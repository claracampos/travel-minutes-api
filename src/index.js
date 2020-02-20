const express = require("express");
require("./database.js");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const auth = require("./auth");

const app = express();
const port = process.env.PORT;

app.listen(port, console.log(`server is running on port ${port}`));

app.use(express.json());

//Reading all entries
app.get("/all-entries", auth, async (req, res) => {
  try {
    const entries = await req.user.entries;
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Adding new entry
app.post("/add-entry", auth, async (req, res) => {
  try {
    const { date, place, seen, done, met, label } = req.body;
    const entry = await req.user.entries.create({
      date: date,
      place: place,
      seen: seen,
      done: done,
      met: met,
      label: label
    });
    await req.user.entries.push(entry);
    await req.user.save();
    res.status(201).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Deleting entry
app.delete("/delete-entry", auth, async (req, res) => {
  try {
    const { entryId } = req.body;
    const entry = await req.user.entries.id(entryId).remove();
    await req.user.save();
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

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
    res.status(401).send({ Error: error.message });
  }
});

//Logging out
app.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens.splice(req.tokens);
    await req.user.save();
    res.status(200).send("Logged out");
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

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
    res.status(500).send({ Error: error.message });
  }
});
