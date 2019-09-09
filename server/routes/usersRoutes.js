const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.route('/')
      .get(async (req, res) => UserController.getMyProfile(req, res));

router.route('/updateProfile')
      .post(async (req, res) => UserController.updateProfile(req, res));

router.route('/updatePassword')
      .post(async (req, res) => UserController.updatePassword(req, res));

router.route('/uploadAvatarSignup')
      .post(async (req, res) => UserController.uploadAvatarSignup(req, res));

router.route('/uploadAvatarEdit')
      .post(async (req, res) => UserController.uploadAvatarEdit(req, res));

module.exports = router;
