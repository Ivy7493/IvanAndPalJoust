const express = require("express");
const IdentityRouter = express.Router();
let nameLib = require("../scripts/nameGen");
const fs = require('fs')
const { statusSuccess } = require("../utils/utils");

IdentityRouter.get("/", function (req, res) {
  res.push([
    "/scripts/join_screen.js",
      "/join.html",
      "/scripts/mainGame.js",
      "/style.css",
      "/scripts/api_layer.js",
      "/scripts/navigation.js",
      "/arrow.svg",
  ], path.join(__dirname, '../../frontend'));

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, '../../frontend/mainGame.html')));
});

IdentityRouter.get("/uniquePlayer", function (req, res) {
  let result = nameLib.GenerateName();
  res.json(statusSuccess(result));
});

module.exports = IdentityRouter;
