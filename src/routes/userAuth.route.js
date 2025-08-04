const express = require('express');
const { createUsers,loginUser } = require('../controller/auth.controller');

const router = express.Router();

router.post('/signup', createUsers);
router.post('/login', loginUser);


module.exports = router;

