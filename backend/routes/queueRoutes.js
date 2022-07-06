const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const path = require("path");
const QueueRoute = express.Router();
const fs = require("fs");
const { ResetGame, GameStarted } = require("./state_game");
const { RunOnHttp2Only } = require("./utils/http2_bridge");
const { time } = require("console");

// A map of player name to the last time they accessed the server.
let authMap = new Map();
let losers = [];

function authList() {
  const out = [];
  for (const x of authMap.keys()) {
    out.push(x);
  }

  return out;
}

QueueRoute.get("/", function (req, res) {
  RunOnHttp2Only(function () {
    res.push(
      [
        "/scripts/start_screen.js",
        "/style.css",
        "/scripts/api_layer.js",
        "/scripts/navigation.js",
        "/arrow.svg",
      ],
      path.join(__dirname, "../../frontend")
    );
  });

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, "../../frontend/start.html")));
});

QueueRoute.post("/player", function (req, res) {
  authList().filter((x) => {
    if (x === req.body.name) {
      res.status(400).json(statusFail("Given name already in use."));
    }
  });

  authMap.set(req.body.name, Date.now());
  // console.log("New Auth List: ", authList());
  res.json(statusSuccess(req.body.name));
});

QueueRoute.delete("/player/:name", function (req, res) {
  RemovePlayerFromList(req.params.name);
  res.json(statusSuccess(req.body.name));
});

QueueRoute.get("/players", function (req, res) {
  res.json(statusSuccess(authList()));
});

QueueRoute.get("/Auth/:name", function (req, res) {
  for (const x of authList()) {
    if (x === req.params.name) {
      res.json(statusSuccess(true));
      return;
    }
  }

  res.json(statusSuccess(false));
});

QueueRoute.post("/Lost", function (req, res) {
  losers.push(req.body.name);
  res.json(statusSuccess(losers));
});

QueueRoute.get("/LostPlayers", function (req, res) {
  res.json(statusSuccess(losers));
});

function RemovePlayerFromList(playerName) {
  authMap.delete(playerName);
  // console.log("New Auth List: ", authList());
}

function CheckPlayerInList(playerName) {
  for (const x of authList()) {
    if (x === playerName) {
      return true;
    }
  }
  return false;
}

function GetAuthList() {
  return authList();
}

function TouchPlayer(playerName) { // needs io to emit code
  if (authMap.has(playerName)) {
    console.log(
      "Touched " + playerName + ": " + (Date.now() / 1000).toFixed(2)
    );
    authMap.set(playerName, Date.now());
  }
}

function ClearPlayers() {
  authMap.clear();
  ("New Auth List: ", authList());
}

function RemoveDeadPlayers() {
  // console.log(authList());
  for (const playerName of authList()) {
    const isDead = Date.now() - authMap.get(playerName) > 5 * 1000;
    if (isDead) {
      // console.log(playerName + " dead");
      RemovePlayerFromList(playerName);
    }
  }

  if (GameStarted()) {
    if (authMap.size <= 1) {
      authMap.clear();
      ResetGame();
    }
  }
}

module.exports = {
  QueueRoute,
  RemovePlayerFromList,
  CheckPlayerInList,
  GetAuthList,
  TouchPlayer,
  RemoveDeadPlayers,
  ClearPlayers,
};
