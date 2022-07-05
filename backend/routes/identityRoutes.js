const express = require("express");
const IdentityRouter = express.Router();
let nameLib = require("../scripts/nameGen");
const { statusSuccess } = require("../utils/utils");

IdentityRouter.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/join.html'))
  res.push([
    "/scripts/join_screen.js",
    "/style.css",
    "/scripts/api_layer.js",
    "/scripts/navigation.js",
    "/arrow.svg"
  ], path.join(__dirname, '../../frontend'));

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, '../../frontend/join.html')));
});

IdentityRouter.get("/uniquePlayer", function (req, res) {
  let result = nameLib.GenerateName();
  res.json(statusSuccess(result));
});

module.exports = IdentityRouter;
