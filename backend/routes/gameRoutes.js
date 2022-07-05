const path = require('path')
const express = require('express');
const { join } = require('path');
const GameRouter = express.Router()

 GameRouter.get('/', function (req, res) {
     res.sendFile(path.join(__dirname, '../../frontend/game.html'))
 })


module.exports = GameRouter