const path = require('path')
const express = require('express');
const { join } = require('path');
const { statusSuccess } = require('../utils/utils');
const GameRouter = express.Router()
const QueueInfo = require("./queueRoutes");

let isDone = true

 GameRouter.get('/', function (req, res) {
     res.sendFile(path.join(__dirname, '../../frontend/game.html'))
 })

 GameRouter.get("/AwaitFinish", function (req, res) {
    res.sendFile(path.join(__dirname, '../../frontend/waiting_for_finish.html'))
});


 GameRouter.put('/start', function (req, res) {
   if(isDone == true){
        isDone = false
   }
   res.json(statusSuccess("Poggers"))
})


 GameRouter.get("/state", function (req, res) {
    temp = {
        isDone: isDone,
        Threshold: 5,
        closeReason: ""
    }
    console.log("Authlist: ",QueueInfo.GetAuthList())
    res.json(statusSuccess(temp))
});

module.exports = GameRouter