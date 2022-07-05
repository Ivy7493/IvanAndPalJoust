const path = require("path");
const express = require("express");
const { join } = require("path");
const { statusSuccess } = require("../utils/utils");
const GameRouter = express.Router();
const fs = require("fs");
const { TouchPlayer, RemoveDeadPlayers } = require("./queueRoutes");
const { IsDone, SetIsDone } = require("./state_game");

GameRouter.get("/", function (req, res) {
  res.push(
    ["/scripts/game.js", "/style.css", "/arrow.svg"],
    path.join(__dirname, "../../frontend")
  );

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, "../../frontend/game.html")));
});

GameRouter.put("/start", function (req, res) {
  if (IsDone() == true) {
    SetIsDone(false);
  }
  res.json(statusSuccess("Poggers"));
});

GameRouter.get("/state/:name", function (req, res) {
  const playerName = req.params.name;
  TouchPlayer(playerName);
  RemoveDeadPlayers();

  temp = {
    isDone: IsDone(),
    Threshold: 50,
    closeReason: "",
  };
  res.json(statusSuccess(temp));
});

module.exports = { GameRouter };
