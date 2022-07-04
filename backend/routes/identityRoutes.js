const express = require("express");
const IdentityRouter = express.Router();
let nameLib = require("../scripts/nameGen");
const { statusSuccess } = require("../utils/utils");

IdentityRouter.get("/", function (req, res) {
  console.log("Poggers!");
});

IdentityRouter.get("/uniquePlayer", function (req, res) {
  let result = nameLib.GenerateName();
  res.json(statusSuccess(result));
});

module.exports = IdentityRouter;
