const express = require("express");
const { statusFail, statusSuccess } = require("../utils/utils");
const path = require('path')
const { join } = require('path');
const waitRouter = express.Router();

waitRouter.get('/')