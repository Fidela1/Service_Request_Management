const express = require('express');
const {createRequest, 
    getAllRequests,
    getRequestById,
    updateRequestById,
    deleteRequestById} = require('../controller/request.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create', protect,createRequest);
router.get('/allRequests', protect, getAllRequests);
router.get('/getRequest/:id', protect, getRequestById);
router.put('/updateRequest/:id', protect, updateRequestById);
router.delete('/deleteRequest/:id', protect, deleteRequestById);
module.exports = router;
