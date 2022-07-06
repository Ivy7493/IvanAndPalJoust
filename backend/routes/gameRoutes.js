const path = require("path");
const express = require("express");
const { statusSuccess } = require("../utils/utils");
const GameRouter = express.Router();
const fs = require("fs");
const {
  TouchPlayer,
  RemoveDeadPlayers,
  GetAuthList,
} = require("./queueRoutes");
const { IsDone, SetIsDone } = require("./state_game");
const { RunOnHttp2Only } = require("./utils/http2_bridge");

let songList = [
  "Umbrella.mp3",
  "cottonEyedJoe.m4a",
  "JMABGRZ-claps-clapping.mp3",
];
let currentSong = "";
let Threshold = 1;
let max = 1.5;
let min = 0.5;
let TempChange = 5000;
console.log("Any poggers and piggers?");
setInterval(ChangeSongSpeed, TempChange);

const socketConnections = new Map();

setInterval(onTick, 1000);

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
    currentSong = songList[Math.floor(Math.random() * songList.length)];
    console.log("Chosen song: ", currentSong);
  }
  res.json(statusSuccess("Poggers"));
});

GameRouter.get("/song", function (req, res) {
  if (currentSong == "") {
    // Logic for multiple songs
  }
  res.json(statusSuccess("/Game/DownloadSong/" + currentSong));
});

GameRouter.get("/DownloadSong", function (req, res) {
  let relativePath = "../songs/" + currentSong;
  console.log("Poggers: ", path.join(__dirname, relativePath));
  res.sendFile(path.join(__dirname, "../songs/" + currentSong));
});

function ChangeSongSpeed() {
  console.log("Any Pig, Poggers");
  console.log("Old Threshold: ", Threshold);
  newThreshold = Math.random() * (max - min) + min;
  Threshold = newThreshold;
  console.log("New Threshold: ", Threshold);
}

function onTick() {
  RemoveDeadPlayers();

  let hasWinner = GetAuthList().length == 1;
  let winner = hasWinner ? GetAuthList()[0] : "";

  const state = {
    isDone: IsDone(),
    threshold: Threshold,
    closeReason: hasWinner ? "winner" : "",
    winner: winner,
    authList: GetAuthList(),
  };

  for (const socket of socketConnections.keys()) {
    socket.emit("state", JSON.stringify(state));
  }
}

function SetupGameServer(expressServer) {
  const { Server } = require("socket.io");
  const io = new Server(expressServer);

  io.on("connection", function (socket) {
    console.log("new connection on game server");

    socket.on("playerId", function (playerId) {
      socketConnections.set(socket, playerId);
      TouchPlayer(playerId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      const playerId = socketConnections.get(socket);
      if (Boolean(playerId)) {
        socketConnections.delete(playerId);
      }
    });
  });
}

module.exports = { GameRouter, SetupGameServer };
