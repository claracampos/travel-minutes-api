const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const { entrySchema } = require("./entry");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("The e-mail provided is not valid.");
      }
    }
  },
  entries: [entrySchema]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
