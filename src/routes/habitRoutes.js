const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const { protect } = require('../middleware/auth');
const { validateHabit, validateHabitEntry } = require('../validators/habitValidators');

router.post('/', protect, validateHabit, habitController.createHabit);
router.get('/', protect, habitController.getHabits);
router.get('/:id', protect, habitController.getHabitById);
router.put('/:id', protect, validateHabit, habitController.updateHabit);
router.delete('/:id', protect, habitController.deleteHabit);
router.post('/:id/entries', protect, validateHabitEntry, habitController.toggleHabitEntry);
router.get('/:id/entries', protect, habitController.getHabitEntries);

module.exports = router;


