const express = require("express");
const path = require("path");
const WaitRouter = express.Router();

WaitRouter.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../../frontend/waiting_for_finish.html"));
});

module.exports = WaitRouter;