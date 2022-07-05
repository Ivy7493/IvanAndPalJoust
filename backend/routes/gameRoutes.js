const path = require('path')
const express = require('express');
const { join } = require('path');
const { statusSuccess } = require('../utils/utils');
const GameRouter = express.Router()
const QueueInfo = require("./queueRoutes")

let isDone = true

 GameRouter.get('/', function (req, res) {
     res.sendFile(path.join(__dirname, '../../frontend/game.html'))
 })

 GameRouter.put('/start', function (req, res) {
   if(isDone == true){
        isDone = false
   }
})

 GameRouter.get("/state/:name", function (req, res) {
    let isPlayerIn = false
    if(QueueInfo.CheckPlayerInList(req.params.name) == true){
        isPlayerIn = true
    }else{
        isPlayerIn = false
    }
    temp = {
        isDone: !isPlayerIn, ///this could be weird if we run into issues later
        Threshold: 5,
        closeReason: ""
    }

    res.json(statusSuccess(temp))
});

module.exports = GameRouter