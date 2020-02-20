const jwt = require("jsonwebtoken");
const User = require("./models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const id = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Authentication error.");
    }
    if (!user.tokens.includes(token)) {
      throw new Error("Authentication error.");
    }
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = auth;
