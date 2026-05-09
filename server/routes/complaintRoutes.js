const express = require('express');
const router = express.Router();
const { getMyComplaints, getComplaintDetail, createComplaint, getCategories } = require('../controllers/complaintController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Categories can be fetched generally 
router.get('/categories', getCategories);

// Protected Citizen Routes
router.get('/', authMiddleware, getMyComplaints);
router.post('/', authMiddleware, upload.single('image'), createComplaint);
router.get('/:id', authMiddleware, getComplaintDetail);

module.exports = router;
