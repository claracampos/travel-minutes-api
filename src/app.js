const express = require("express");
require("./database/database.js");
const router = require("./router/router.js");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));
app.use(router);

module.exports = app;
