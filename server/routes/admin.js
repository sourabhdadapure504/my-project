const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUser, deleteUser, getAllScans } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));
router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/scans', getAllScans);

module.exports = router;
