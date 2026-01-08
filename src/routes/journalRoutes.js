const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { protect } = require('../middleware/auth');
const { validateJournal } = require('../validators/journalValidators');

router.post('/', protect, validateJournal, journalController.createJournal);
router.get('/', protect, journalController.getJournals);
router.get('/:id', protect, journalController.getJournalById);
router.put('/:id', protect, validateJournal, journalController.updateJournal);
router.delete('/:id', protect, journalController.deleteJournal);

module.exports = router;


