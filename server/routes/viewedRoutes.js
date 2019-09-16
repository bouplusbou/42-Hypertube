const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const ViewedController = require('../controllers/ViewedController');

// router.get('/', authenticate, async (req, res) => UserController.getMyProfile(req, res));
router.get('/', async (req, res) => ViewedController.SetViewed(req, res));

module.exports = router;