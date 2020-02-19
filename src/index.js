const express = require("express");
const app = express();
const port = process.env.PORT;
const database = require("./database.js");

app.listen(port, console.log(`server is running on port ${port}`));

app.get("/", async (req, res) => {
  try {
    const users = await database.fetchUsers();
    res.send(users);
  } catch {
    res.send("error");
  }
});
