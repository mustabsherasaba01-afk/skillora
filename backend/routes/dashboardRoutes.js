const express = require('express');
const authorize = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { clientDashboard, freelancerDashboard } = require('../controllers/dashboardController');
const router = express.Router();
router.get('/client', protect, authorize('client'), clientDashboard);
router.get('/freelancer', protect, authorize('freelancer'), freelancerDashboard);
module.exports = router;
