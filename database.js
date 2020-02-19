const mongoose = require("mongoose");

exports.fetchUsers = async () => {
  mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  const User = mongoose.model("User", {
    name: String
  });

  const users = User.find();
  return users;
};
