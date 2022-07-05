const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const path = require("path");
const { join } = require("path");
const QueueRoute = express.Router();
<<<<<<< HEAD
const fs = require('fs')
=======
const fs = require("fs");
const { ResetGame } = require("./gameRoutes");
>>>>>>> 9f1c34c9cadda13f205cb7477c3828a17a5e56e6

let authList = [];
let gameStarted = false;

QueueRoute.get("/", function (req, res) {
<<<<<<< HEAD
  res.push([
    "/scripts/start_screen.js",
    "/style.css",
    "/scripts/api_layer.js",
    "/scripts/navigation.js",
    "/arrow.svg"
  ], path.join(__dirname, '../../frontend'));

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, '../../frontend/start.html')));
=======
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
>>>>>>> 9f1c34c9cadda13f205cb7477c3828a17a5e56e6
});

QueueRoute.post("/player", function (req, res) {
  authList.filter((x) => {
    if (x == req.body.name) {
      res.status(400).json(statusFail("Given name already in use."));
    }
    console.log("New Auth List: ", authList);
  });

  authList.push(req.body.name);
  res.json(statusSuccess(req.body.name));
});

QueueRoute.delete("/player/:name", function (req, res) {
  authList = authList.filter((x) => {
    if (x != req.params.name) {
      return x;
    }
  });

  if (authList.length === 0) {
    ResetGame();
  }
  res.json(statusSuccess(req.body.name));
});

QueueRoute.get("/players", function (req, res) {
  res.json(statusSuccess(authList));
});

QueueRoute.get("/start", function (req, res) {
  if (gameStarted == false) {
    gameStarted = true;
  }

  res.json("Okay");
});

QueueRoute.get("/Auth/:name", function (req, res) {
<<<<<<< HEAD
    for(const x of authList){
      if(x == req.params.name){
        res.json(statusSuccess(true))
        return;
      }
    }

    res.json(statusSuccess(false))
=======
  for (const x of authList) {
    if (x == req.params.name) {
      res.json(statusSuccess(true));
      return;
    }
  }

  res.json(statusSuccess(false));
>>>>>>> 9f1c34c9cadda13f205cb7477c3828a17a5e56e6
});

function RemovePlayerFromList(playeName) {
  authList = authList.filter((x) => {
    if (x != playeName) {
      return x;
    }
  });
}

<<<<<<< HEAD
function CheckPlayerInList(playerName){
  for(const x of authList){
    if(x == playerName){
      return true
=======
function CheckPlayerInList(playerName) {
  for (const x of authList) {
    if (x == playerName) {
      return true;
>>>>>>> 9f1c34c9cadda13f205cb7477c3828a17a5e56e6
    }
  }
  return false;
}

function GetAuthList() {
  return authList;
}

module.exports = {
  QueueRoute,
  RemovePlayerFromList,
  CheckPlayerInList,
  GetAuthList,
};
