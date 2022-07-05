const express = require("express");
const fs = require("fs");
const path = require("path");
const { join } = require("path");
const mainRouter = express.Router();

mainRouter.get("/", function (req, res) {
  res.push(
    [
      "/scripts/join_screen.js",
      "/style.css",
      "/scripts/api_layer.js",
      "/scripts/navigation.js",
      "/arrow.svg",
    ],
    path.join(__dirname, "../../frontend")
  );

  res.writeHead(200);
  res.end(fs.readFileSync(path.join(__dirname, "../../frontend/join.html")));
});

module.exports = mainRouter;
