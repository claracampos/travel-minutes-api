const express = require("express");
require("./database.js");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const auth = require("./auth");

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
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.checkCredentials(email, password);
    const token = await validUser.generateAuthToken();
    res.status(200).send({ JWT: token });
  } catch (error) {
    res.status(401);
    res.send({ Error: error.message });
  }
});

//Logging out

//Registering a new user
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    await User.doesUserExist(email);
    const newUser = {
      email: email,
      password: await bcrypt.hash(password, 8)
    };
    const savedUser = await User.create(newUser);
    const token = await savedUser.generateAuthToken();
    res.status(201).send({ JWT: token });
  } catch (error) {
    res.status(500);
    res.send({ Error: error.message });
  }
});
