const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const path = require("path");
const QueueRoute = express.Router();
const fs = require("fs");
const { ResetGame, GameStarted } = require("./state_game");

// A map of player name to the last time they accessed the server.
let authMap = new Map();

function authList() {
  const out = [];
  for (const x of authMap.keys()) {
    out.push(x);
  }

  return out;
}

QueueRoute.get("/", function (req, res) {
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

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, "../../frontend/start.html")));
});

QueueRoute.post("/player", function (req, res) {
  authList().filter((x) => {
    if (x === req.body.name) {
      res.status(400).json(statusFail("Given name already in use."));
    }
    console.log("New Auth List: ", authList());
  });

  authMap.set(req.body.name, Date.now());
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

function RemovePlayerFromList(playerName) {
  authMap.delete(playerName);
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

function TouchPlayer(playerName) {
  if (authMap.has(playerName)) {
    console.log("Touched player")
    authMap.set(playerName, Date.now());
  }
}

function RemoveDeadPlayers() {
  console.log(authList());
  for (const playerName of authList()) {
    const isDead = Date.now() - authMap.get(playerName) > 3 * 1000;
    if (isDead) {
      console.log("Player dead");
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
};
