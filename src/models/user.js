const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("The e-mail provided is not valid.");
      }
    }
  }
});

module.exports = User;
