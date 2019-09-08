const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserController = require('../controllers/UserController');
const passport = require('passport');
const authenticate = require('../middlewares/authenticate');
const ObjectID = require('mongodb').ObjectID;

router.route('/failureRedirect')
      .get( (req, res) => {console.log('inside failure'); res.redirect("http://localhost:3000/myProfile");} );


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
      async (req, res) => {
            const mongoId = new ObjectID(req.user);
            const authToken = await jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            console.log(authToken);
            res.redirect("http://localhost:3000/redirect?authToken=" + authToken);
      });


router.route('/42')
      .get( passport.authenticate('42', { session: false }) );

router.route('/42/callback')
      .get( passport.authenticate('42', { session: false, failureRedirect: '/api/auth/failureRedirect' }),
      async (req, res) => {
            const mongoId = new ObjectID(req.user);
            const authToken = await jwt.sign({ mongoId: mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            res.redirect("http://localhost:3000/redirect?authToken=" + authToken);
      });

module.exports = router;
