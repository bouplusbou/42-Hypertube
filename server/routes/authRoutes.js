const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserController = require('../controllers/UserController');
const passport = require('passport');
const authenticate = require('../middlewares/authenticate');

router.route('/userIsAuthenticated')
      .get(authenticate, (req, res) => res.status(200).send('User authenticated'));

router.route('/signup')
      .post(async (req, res) => UserController.findOrCreateUser(req, res));

router.route('/login')
      .post(async (req, res) => UserController.loginUser(req, res));

router.route('/google')
      .get( passport.authenticate('google', { session: false, scope: ['profile'] }) );

router.route('/google/callback')
      .get( passport.authenticate('google', { session: false, failureRedirect: '/login' }),
      (req, res) => {
            const mongoId = req.user;
            const authToken = jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            res.redirect("http://localhost:3000/home?authToken=" + authToken);
      });

router.route('/42')
      .get( passport.authenticate('42', { session: false }) );

router.route('/42/callback')
      .get( passport.authenticate('42', { session: false, failureRedirect: '/login' }),
      (req, res) => {
            const mongoId = req.user;
            const authToken = jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            res.redirect("http://localhost:3000/home?authToken=" + authToken);
      });

module.exports = router;
