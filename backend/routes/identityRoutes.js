const path = require('path')
const express = require('express');
const { join } = require('path');
const IdentityRouter = express.Router()
let nameLib = require('../scripts/nameGen')


IdentityRouter.get('/', function (req, res) {

    console.log("Poggers!")
})


IdentityRouter.get("/uniquePlayer",function(req,res){
    let result = nameLib.GenerateName()
    console.log("The name is: ",result)
    res.json(result)
})



module.exports = IdentityRouter