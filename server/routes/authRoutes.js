const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserController = require('../controllers/UserController');
const passport = require('passport');
const authenticate = require('../middlewares/authenticate');
const ObjectID = require('mongodb').ObjectID;

router.get('/failureRedirect', (req, res) => { res.redirect("http://localhost:3000/login");} );
router.get('/userIsAuthenticated', authenticate, (req, res) => res.status(200).send('User authenticated'));
router.post('/signup', async (req, res) => UserController.findOrCreateUser(req, res));
router.post('/login', async (req, res) => UserController.loginUser(req, res));
router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }) );
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failureRedirect' }),
      async (req, res) => {
            const mongoId = new ObjectID(req.user);
            const authToken = await jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            res.redirect("http://localhost:3000/redirect?authToken=" + authToken);
      });
router.get('/42', passport.authenticate('42', { session: false }) );
router.get('/42/callback', passport.authenticate('42', { session: false, failureRedirect: '/api/auth/failureRedirect' }),
      async (req, res) => {
            const mongoId = new ObjectID(req.user);
            const authToken = await jwt.sign({ mongoId: mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            res.redirect("http://localhost:3000/redirect?authToken=" + authToken);
      });

module.exports = router;
