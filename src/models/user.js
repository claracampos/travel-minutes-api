const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const { entrySchema } = require("./entry");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("The e-mail provided is not valid.");
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  entries: [entrySchema],
  tokens: [{ type: String, required: true }]
});

userSchema.statics.doesUserExist = async function(email) {
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new Error("The e-mail provided is already registered.");
  }
};

userSchema.statics.checkCredentials = async function(email, password) {
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    throw new Error("That account does not exist.");
  }
  const doesPasswordMatch = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!doesPasswordMatch) {
    throw new Error("The password is incorrect.");
  }
  return existingUser;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign(user._id.toString(), process.env.SECRET);
  if (!user.tokens.includes(token)) {
    user.tokens = user.tokens.concat(token);
    user.save();
  }
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
