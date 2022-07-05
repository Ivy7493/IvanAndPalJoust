const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const path = require('path')
const { join } = require('path');
const QueueRoute = express.Router();
const fs = require('fs')

let authList = [];
let connectedPlayers = 0;
let gameStarted = false;

QueueRoute.get("/", function (req, res) {
  res.push([
    "/scripts/start_screen.js",
    "/style.css",
    "/scripts/api_layer.js",
    "/scripts/navigation.js",
    "/arrow.svg"
  ], path.join(__dirname, '../../frontend'));

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, '../../frontend/start.html')));
});

QueueRoute.post("/player", function (req, res) {
  authList.filter((x) => {
    if (x == req.body.name) {
      res.status(400).json(statusFail("Given name already in use."));
    }
    console.log("New Auth List: ",authList)
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

  res.json(statusSuccess(req.body.name));
});

QueueRoute.get("/players", function (req, res) {
  res.json(statusSuccess(authList));
});

QueueRoute.get("/start", function (req, res) {
    if(gameStarted == false){
      gameStarted = true
    }

    res.json("Okay")
});


QueueRoute.get("/Auth/:name", function (req, res) {
    for(x in authList){
      if(x == req.params.name){
        return res.json(statusSuccess(true))
      }
    }
    res.json(statusFail(false))
});

function RemovePlayerFromList(playeName){
  authList = authList.filter(x=>{
    if(x != playeName){
      return x
    }
  })
}

function CheckPlayerInList(playerName){
  for(x in authList){
    if(x == playerName){
      return true
    }
  }
  return false
}

function GetAuthList(){
  return authList
}



module.exports = {QueueRoute,RemovePlayerFromList,CheckPlayerInList,GetAuthList};
