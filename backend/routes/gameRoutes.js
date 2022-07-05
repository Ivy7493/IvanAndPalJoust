const path = require("path");
const express = require("express");
const { join } = require("path");
const { statusSuccess } = require("../utils/utils");
const GameRouter = express.Router();
const QueueInfo = require("./queueRoutes");
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
<<<<<<< HEAD
    Threshold: 5,
=======
    Threshold: 50,
>>>>>>> 9f1c34c9cadda13f205cb7477c3828a17a5e56e6
    closeReason: "",
  };
  console.log("Authlist: ", QueueInfo.GetAuthList());
  res.json(statusSuccess(temp));
});

<<<<<<< HEAD
module.exports = GameRouter;
=======
function ResetGame() {
  isDone = true;
}

module.exports = { GameRouter, ResetGame };
>>>>>>> 9f1c34c9cadda13f205cb7477c3828a17a5e56e6
