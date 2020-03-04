const User = require("../../src/database/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const testUserId = new mongoose.Types.ObjectId();

const testUser = {
  _id: testUserId,
  email: "test@gmail.com",
  password: "testing123",
  tokens: [jwt.sign(testUserId.toString(), process.env.SECRET)]
};

const testUserAuth = { Authorization: testUser.tokens[0] };

const setUpDatabase = async () => {
  await User.deleteMany();
  await User.create({
    _id: testUser._id,
    email: testUser.email,
    password: await bcrypt.hash(testUser.password, 8),
    entries: [],
    tokens: testUser.tokens
  });
};

module.exports = { testUser, testUserId, testUserAuth, setUpDatabase };
