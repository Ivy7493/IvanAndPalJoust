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

const socketConnections = new Map();
let currentSong = "cottonEyedJoe.m4a";

let players = []; // list of players

setInterval(onTick, 250);

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
  }
  res.json(statusSuccess("Poggers"));
});

GameRouter.get("/song", function (req, res) {
  if (currentSong == "") {
    // Logic for multiple songs
  }
  res.json(statusSuccess(path.join(__dirname, currentSong)));
});

function onTick() {
  RemoveDeadPlayers();

  let hasWinner = GetAuthList().length == 1;
  let winner = hasWinner ? GetAuthList()[0] : "";

  const state = {
    isDone: IsDone(),
    threshold: 50,
    closeReason: hasWinner ? "winner" : "",
    winner: winner,
  };

  for (const socket of socketConnections.keys()) {
    socket.emit("state", JSON.stringify(state));
  }
}

// socket

let currentGameState = {
  threshold: 50,
  isDone: false,
  closeReason: "",
  winner: "",
}

function SetupGameServer(expressServer) {
  const { Server } = require("socket.io");
  const io = new Server(expressServer);

  io.on("connection", function (socket) {
    console.log("new connection on game server");

    socket.on("playerId", function (playerId) {
      socketConnections.set(socket, playerId);
      
      players.push(playerId);
      io.emit("playerList", players);
    });

    socket.on("start", function (start) {
      players.push(playerId);
      io.emit("playerList", players);
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
