const path = require('path')
const express = require('express');
const { join } = require('path');
const { statusSuccess } = require('../utils/utils');
const GameRouter = express.Router()

let isDone = true
let activePlayers = []

 GameRouter.get('/', function (req, res) {
    isDone = false
     res.sendFile(path.join(__dirname, '../../frontend/game.html'))
 })

 GameRouter.get("/state", function (req, res) {
    temp = {
        isDone: isDone,
        Threshold: 5,
        closeReason: ""
    }

    res.json(statusSuccess(temp))
});

module.exports = GameRouter