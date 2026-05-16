const express = require('express');
const router = express.Router();
const { createScan, getScans, getScan, deleteScan, getDashboardStats } = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createScan);
router.get('/', getScans);
router.get('/stats', getDashboardStats);
router.get('/:id', getScan);
router.delete('/:id', deleteScan);

module.exports = router;
