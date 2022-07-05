const path = require("path");
const express = require("express");
const { join } = require("path");
const { statusSuccess } = require("../utils/utils");
const GameRouter = express.Router();
const fs = require("fs");

let isDone = true;

GameRouter.get("/", function (req, res) {
  res.push(
    ["/scripts/game.js", "/style.css", "/arrow.svg"],
    path.join(__dirname, "../../frontend")
  );

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, "../../frontend/game.html")));
});

GameRouter.put("/start", function (req, res) {
  if (isDone == true) {
    isDone = false;
  }
  res.json(statusSuccess("Poggers"));
});

GameRouter.get("/state", function (req, res) {
  temp = {
    isDone: isDone,
    Threshold: 50,
    closeReason: "",
  };
  res.json(statusSuccess(temp));
});

function ResetGame() {
  isDone = true;
}

module.exports = { GameRouter, ResetGame };
