const express = require('express');
const router = express.Router();
const { getLayout, saveLayout } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/layout', getLayout);
router.post('/layout', saveLayout);
module.exports = router;
