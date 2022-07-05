const express = require("express");

let isDone = true;
let gameStarted = false;

function ResetGame() {
  isDone = true;
  gameStarted = false;
}

function SetIsDone(inIsDone) {
  isDone = inIsDone;
  if(!isDone) {
    gameStarted = true;
  }
}

function IsDone() {
  return isDone;
}

function GameStarted() {
  return gameStarted;
}

module.exports = { ResetGame, SetIsDone, IsDone, GameStarted };
