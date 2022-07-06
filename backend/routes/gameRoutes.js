const path = require("path");
const express = require("express");
const { join } = require("path");
const { statusSuccess } = require("../utils/utils");
const GameRouter = express.Router();
const fs = require("fs");
const { TouchPlayer, RemoveDeadPlayers } = require("./queueRoutes");
const { IsDone, SetIsDone } = require("./state_game");
const { RunOnHttp2Only } = require("./utils/http2_bridge");

//let currentSong = "cottonEyedJoe.m4a";
let songList = ['Umbrella.mp3','cottonEyedJoe.m4a']
let currentSong = ""
let Threshold = 1
let max = 1.5
let min = 0.5
let TempChange = 5000
console.log("Any poggers and piggers?")
setInterval(ChangeSongSpeed,5000)


GameRouter.get("/", function (req, res) {
  RunOnHttp2Only(function () {
    res.push(
      ["/scripts/game.js", "/style.css", "/arrow.svg"],
      path.join(__dirname, "../../frontend")
    );
  });

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, "../../frontend/game.html")));
});

GameRouter.put("/start", function (req, res) {
  if (IsDone() == true) {
    SetIsDone(false);
    currentSong = songList[Math.floor(Math.random()*songList.length)];
    console.log("Chosen song: ",currentSong)
    setInterval(ChangeSongSpeed,5000)
  }
  res.json(statusSuccess("Poggers"));
});

GameRouter.get("/state/:name", function (req, res) {
  const playerName = req.params.name;
  TouchPlayer(playerName);
  console.log(playerName)
  RemoveDeadPlayers();

  temp = {
    isDone: IsDone(),
    Threshold: Threshold,
    closeReason: "",
  };
  res.json(statusSuccess(temp));
});

GameRouter.get("/song", function (req, res) {
  if (currentSong == "") {
    // Logic for multiple songs
  
  }
  res.json(statusSuccess('/Game/DownloadSong'));
});


GameRouter.get("/DownloadSong",function(req,res){
  let relativePath = "../songs/"+currentSong
  console.log("Poggers: ",path.join(__dirname,relativePath))
  res.sendFile(path.join(__dirname,"../songs/"+currentSong))
})


function ChangeSongSpeed(){
  console.log("Any Pig, Poggers")
  console.log("Old Threshold: ", Threshold)
  newThreshold = Math.random() * (max - min) + min;
  Threshold = newThreshold
  console.log("New Threshold: ", Threshold)
}

module.exports = { GameRouter };
