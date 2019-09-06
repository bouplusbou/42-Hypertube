const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.route('/')
      .get(async (req, res) => UserController.getMyProfile(req, res));

module.exports = router;
