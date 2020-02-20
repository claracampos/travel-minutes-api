const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  place: { type: String, required: true, maxlength: 50 },
  date: { type: String, required: true, maxlength: 10 },
  done: { type: String, required: true, maxlength: 100 },
  met: { type: String, required: true, maxlength: 100 },
  seen: { type: String, required: true, maxlength: 100 },
  label: { type: String, maxlength: 50 }
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = { Entry, entrySchema };
