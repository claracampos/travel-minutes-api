const express = require("express");
require("./database/database.js");
const User = require("./database/user");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT;

app.listen(port, console.log(`server is running on port ${port}`));

app.use(express.json());
app.use(express.static("public"));

//Read all entries
app.get("/all-entries", auth, async (req, res) => {
  try {
    const entries = await req.user.entries;
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Find entry by Id
app.get("/entry-id", auth, async (req, res) => {
  try {
    const entryId = req.body.entryId;
    const entry = await req.user.findEntryById(entryId);
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Add new entry
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

//Delete entry
app.delete("/delete-entry", auth, async (req, res) => {
  try {
    const { entryId } = req.body;
    const entry = await req.user.findEntryById(entryId);
    await entry.remove();
    await req.user.save();
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Edit entry
app.patch("/edit-entry", auth, async (req, res) => {
  try {
    const { entryId, seen, done, met } = req.body;
    const entry = await req.user.findEntryById(entryId);
    entry.seen = seen;
    entry.done = done;
    entry.met = met;
    await req.user.save();
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Log in
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

//Log out
app.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens.splice(req.tokens);
    await req.user.save();
    res.status(200).send("Logged out");
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Register a new user
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (password.length < 7 || password.length > 12) {
      throw new Error("Password must contain 7 to 12 characters");
    }
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

//Change password
app.patch("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const doesPasswordMatch = await bcrypt.compare(
      oldPassword,
      req.user.password
    );
    if (!doesPasswordMatch) {
      throw new Error("The password is incorrect.");
    }
    if (newPassword.length < 7 || newPassword.length > 12) {
      throw new Error("Password must contain 7 to 12 characters.");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    req.user.password = hashedPassword;
    await req.user.save();
    res.status(200).send("Password changed");
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});
