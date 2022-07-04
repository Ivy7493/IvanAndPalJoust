const path = require('path')
const express = require('express');
const { join } = require('path');
const QueueRoute = express.Router()
let authList = []

QueueRoute.get('/', function (req, res) {

    console.log("Poggers!")
})


QueueRoute.post('/player', function (req, res) {
    authList.filter(x => {
        if (x == req.body.name) {
            res.status(400).json('FAILED')
        }
    })
    authList.push(req.body.name)
})

QueueRoute.delete('/player', function (req, res) {
    authList = authList.filter(x => {
        if (x != req.body.name) {
            return x
        }
    })
    res.json("SUCCESS")
})


QueueRoute.get('/players', function (req, res) {
    res.json(authList)
})


module.exports = QueueRoute