const express = require('express');
const userAuth = require('./userAuth.route');
const router = express.Router()

router.use('/auth', userAuth);
module.exports = router;