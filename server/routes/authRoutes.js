const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserController = require('../controllers/UserController');
const axios = require('axios');


router.route('/signup')
      .post(async (req, res) => UserController.findOrCreateUser(req, res));

// router.route('/login')
//       .post(async (req, res) => {
//             // ADD VALIDATIONS
//             const { username, password } = req.body;
//             const user = await User.findOne({ username })
//             if (!user) return res.status(404).json({ error: "Email not found" });
//             const isMatch = await bcrypt.compare(password, user.password)
//             if (isMatch) {
//                   const payload = { id: user.id, username: user.username };
//                   jwt.sign(
//                         payload,
//                         keys.secret,
//                         { expiresIn: 31556926 },
//                         (err, token) => {
//                               res.json({
//                                     success: true,
//                                     token: "Bearer " + token
//                               });
//                         }
//                   );
//             } else {
//                   return res.status(400).json({ error: "Password incorrect" });
//             }
//     });

const passport = require('passport');

router.route('/google')
      .get( passport.authenticate('google', { session: false, scope: ['profile'] }) );

router.route('/google/callback')
      .get( passport.authenticate('google', { session: false, failureRedirect: '/login' }),
      function(req, res) {
            const mongoId = req.user;
            const authToken = jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            res.redirect("http://localhost:3000/home?authToken=" + authToken);
      });


router.route('/42')
      .get( passport.authenticate('42', { session: false }) );

router.route('/42/callback')
      .get( passport.authenticate('42', { session: false, failureRedirect: '/login' }),
      function(req, res) {
            const mongoId = req.user;
            const authToken = jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
            res.redirect("http://localhost:3000/home?authToken=" + authToken);
      });

module.exports = router;
