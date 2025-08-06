const express = require('express');
const {createRequest, 
    getAllRequests,
    getRequestById,
    updateRequestById,
    deleteRequestById,
    updateRequestStatus} = require('../controller/request.controller');
const { protect } = require('../middleware/auth.middleware');
const {isAdmin, deleteMiddleware} = require('../middleware/admin.middleware')

const router = express.Router();

router.post('/create', protect,createRequest);
router.get('/allRequests', protect,isAdmin, getAllRequests);
router.get('/getRequest/:id', protect, getRequestById);
router.put('/updateRequest/:id', protect, updateRequestById);
router.put('/updateRequestStatus/:id', protect, isAdmin,updateRequestStatus);
router.delete('/deleteRequest/:id', protect,deleteRequestById);
module.exports = router;
