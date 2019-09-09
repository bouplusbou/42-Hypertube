const express = require('express');
const router = express.Router();
 
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./usersRoutes'));
router.use('/search', require('./searchRoutes'));

module.exports = router;
