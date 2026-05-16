const express = require('express');
const router = express.Router();
const { getScanReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/:id', getScanReport);

module.exports = router;
