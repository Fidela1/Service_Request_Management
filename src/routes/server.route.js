const express = require('express');
const userAuth = require('./userAuth.route');
const request = require('./request.route');
const router = express.Router()

router.use('/auth', userAuth);
router.use('/request', request);

module.exports = router;