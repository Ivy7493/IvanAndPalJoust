const path = require('path')
const express = require('express');
const { join } = require('path');
const QueueRoute = express.Router()


QueueRoute.get('/', function (req, res) {

    console.log("Poggers!")
})


module.exports = QueueRoute