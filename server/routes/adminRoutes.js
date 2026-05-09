const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { getAllComplaints, updateComplaintStatus, getSummaryAnalytics, getCategoryAnalytics, getUsers, updateUserRole } = require('../controllers/adminController');

router.use(authMiddleware, adminMiddleware);

router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id', updateComplaintStatus);

router.get('/analytics/summary', getSummaryAnalytics);
router.get('/analytics/category', getCategoryAnalytics);

router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
