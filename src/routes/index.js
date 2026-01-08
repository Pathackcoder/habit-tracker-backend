const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const habitRoutes = require('./habitRoutes');
const journalRoutes = require('./journalRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const settingsRoutes = require('./settingsRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/habits', habitRoutes);
router.use('/journals', journalRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;


