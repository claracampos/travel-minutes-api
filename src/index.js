const express = require("express");
require("./database.js");
const User = require("./models/user");
const Entry = require("./models/entry");

const app = express();
const port = process.env.PORT;

app.listen(port, console.log(`server is running on port ${port}`));

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

app.get("/entries", async (req, res) => {
  try {
    const entries = await Entry.find();
    res.send(entries);
  } catch (error) {
    res.send(error);
  }
});
