const express = require("express");
require("./database.js");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT;

app.listen(port, console.log(`server is running on port ${port}`));

app.use(express.json());

//Reading entries

//Adding new entry

//Deleting entry

//Editing entry

//Changing password

//Logging in

//Logging out

//Registering a new user
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = {
      email: email,
      password: await bcrypt.hash(password, 8)
    };
    await User.doesUserExist(email);
    await User.create(newUser);
    res.status(201);
    res.send("registered");
  } catch (error) {
    res.status(500);
    res.send({ Error: error.message });
  }
});
