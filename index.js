const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({ testing: "123" });
});

app.listen(3000, console.log("server running"));
