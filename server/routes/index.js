const express = require('express');
const router = express.Router();
 
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./usersRoutes'));
router.use('/player', require('./playerRoutes'));

module.exports = router;
