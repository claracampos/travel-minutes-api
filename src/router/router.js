const express = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const User = require("../database/user");

const router = new express.Router();

//Read all entries
router.get("/entries", auth, async (req, res) => {
  try {
    const entries = await req.user.entries;
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Find entry by Id
router.get("/entries/:id", auth, async (req, res) => {
  try {
    const entryId = req.params.id;
    const entry = await req.user.findEntryById(entryId);
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Add new entry
router.post("/entries", auth, async (req, res) => {
  try {
    const { date, place, seen, done, met, label } = req.body;
    const entry = await req.user.entries.create({
      date,
      place,
      seen,
      done,
      met,
      label
    });
    await req.user.entries.push(entry);
    await req.user.save();
    res.status(201).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Delete entry
router.delete("/entries/:id", auth, async (req, res) => {
  try {
    const entryId = req.params.id;
    const entry = await req.user.findEntryById(entryId);
    await entry.remove();
    await req.user.save();
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Edit entry
router.patch("/entries/:id", auth, async (req, res) => {
  try {
    const entryId = req.params.id;
    const { seen, done, met } = req.body;
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
router.post("/login", async (req, res) => {
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
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens.splice(req.tokens);
    await req.user.save();
    res.status(200).send("Logged out");
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});

//Register a new user
router.post("/register", async (req, res) => {
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
router.patch("/password", auth, async (req, res) => {
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

module.exports = router;
