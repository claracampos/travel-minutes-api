const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const { entrySchema } = require("./entry");
const bcrypt = require("bcryptjs");

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
  entries: [entrySchema]
});

userSchema.statics.doesUserExist = async function(email) {
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new Error("The e-mail provided is already registered.");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
