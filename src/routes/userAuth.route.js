const express = require('express');
const { createUsers,
        loginUser,
        getAllUsers,
        deleteUserById } = require('../controller/auth.controller');
const {isAdmin} = require('../middleware/admin.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', createUsers);
router.post('/login', loginUser);
router.get('/getAllUsers',protect,isAdmin,getAllUsers);
router.delete('/deleteUser/:id', protect, isAdmin, deleteUserById);

module.exports = router;

