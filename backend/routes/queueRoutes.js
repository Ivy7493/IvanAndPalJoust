const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const path = require('path')
const { join } = require('path');
const QueueRoute = express.Router();

let authList = [];
let connectedPlayers = 0;
let gameStarted = false;

QueueRoute.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/start.html'));
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
    for(const x of authList){
      if(x == req.params.name){
        res.json(statusSuccess(true))
        return;
      }
    }

    res.json(statusSuccess(false))
});

function RemovePlayerFromList(playeName){
  authList = authList.filter(x=>{
    if(x != playeName){
      return x
    }
  })
}

function CheckPlayerInList(playerName){
  for(const x of authList){
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
