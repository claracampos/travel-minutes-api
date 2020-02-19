const express = require("express");
require("./database.js");
const User = require("./models/user");
const { Entry } = require("./models/entry");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT;

app.listen(port, console.log(`server is running on port ${port}`));

app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = {
      email: email,
      password: await bcrypt.hash(password, 8)
    };
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("user already exists");
    }
    await User.create(newUser);
    res.send("registered");
  } catch (error) {
    res.status(500);
    console.log(error);
    res.send(error);
  }
});
