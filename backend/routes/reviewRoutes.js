const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createReview, listReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const router = express.Router();
router.post('/', protect, createReview);
router.get('/user/:userId', listReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
module.exports = router;
