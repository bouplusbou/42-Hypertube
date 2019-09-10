const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const UserController = require('../controllers/UserController');

router.route(authenticate, '/')
      .get(async (req, res) => UserController.getMyProfile(req, res));

router.route(authenticate, '/:username')
      .get(async (req, res) => UserController.getProfile(req, res));

router.route(authenticate, '/updateProfile')
      .post(async (req, res) => UserController.updateProfile(req, res));

router.route(authenticate, '/updatePassword')
      .post(async (req, res) => UserController.updatePassword(req, res));

router.route(authenticate, '/uploadAvatarSignup')
      .post(async (req, res) => UserController.uploadAvatarSignup(req, res));

router.route(authenticate, '/uploadAvatarEdit')
      .post(async (req, res) => UserController.uploadAvatarEdit(req, res));

module.exports = router;
