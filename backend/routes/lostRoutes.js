const express = require("express");
const path = require("path");
const fs = require("fs");
const LostRoutes = express.Router();

LostRoutes.get("/", function (req, res) {
  res.push([
    "/scripts/player_lost_screen.js",
    "/audio/lose.mp3",
    "/style.css",
    "/scripts/api_layer.js",
    "/scripts/navigation.js",
    "/arrow.svg"
  ], path.join(__dirname, '../../frontend'));

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, '../../frontend/player_lost_screen.html')));
});


module.exports = LostRoutes;
