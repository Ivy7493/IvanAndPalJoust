const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const QueueRoute = express.Router();

let authList = [];

QueueRoute.get("/", function (req, res) {
  console.log("Poggers!");
});

QueueRoute.post("/player", function (req, res) {
  authList.filter((x) => {
    if (x == req.body.name) {
      res.status(400).json(statusFail("Given name already in use."));
    }
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

module.exports = QueueRoute;
