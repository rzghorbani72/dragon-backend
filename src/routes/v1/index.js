const express = require('express');
const authRoutes = require('./auth.route');
const categoryRoutes = require('./category.route');
const courseRoutes = require('./course.route');
const videoRoutes = require('./video.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/course', courseRoutes);
router.use('/video', videoRoutes);

module.exports = router;
