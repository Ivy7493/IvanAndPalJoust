const express = require("express");
const fs = require("fs");
const path = require("path");
const { join } = require("path");
const mainRouter = express.Router();
const { RunOnHttp2Only } = require("./utils/http2_bridge");

mainRouter.get("/", function (req, res) {
  RunOnHttp2Only(function () {
    res.push(
      [
        "/scripts/join_screen.js",
        "/join.html",
        "/scripts/mainGame.js",
        "/style.css",
        "/scripts/api_layer.js",
        "/scripts/navigation.js",
        "/arrow.svg",
      ],
      path.join(__dirname, "../../frontend")
    );
  });

  res.writeHead(200);
  res.end(
    fs.readFileSync(path.join(__dirname, "../../frontend/mainGame.html"))
  );
});

module.exports = mainRouter;
