const express = require('express');
const router = express.Router();
 
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./usersRoutes'));

module.exports = router;
