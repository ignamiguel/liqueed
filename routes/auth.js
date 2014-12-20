'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth');

router.get('/signin', controller.signIn);

module.exports = router;
