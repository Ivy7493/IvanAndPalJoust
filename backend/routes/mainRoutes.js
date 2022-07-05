const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const path = require('path')
const { join } = require('path');
const mainRouter = express.Router();

mainRouter.get("/", function (req, res) {
    console.log("Pggers");
    res.sendFile(path.join(__dirname, '../../frontend/join.html'));
  });





module.exports = mainRouter