const mongoose = require("mongoose");

const Entry = mongoose.model("Entry", {
  place: { type: String, required: true, maxlength: 50 },
  date: { type: String, required: true, maxlength: 10 },
  done: { type: String, required: true, maxlength: 100 },
  met: { type: String, required: true, maxlength: 100 },
  seen: { type: String, required: true, maxlength: 100 }
});

module.exports = Entry;
