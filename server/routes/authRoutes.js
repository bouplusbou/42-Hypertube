const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/UserModel');
const axios = require('axios');

router.route('/signup')
      .post(async (req, res) => {
            // console.log(req.body);
            const user = await User.findOne({ email: req.body.email });
            if (user) return res.status(400).json({ error: 'Email already exists' });
            const newUser = new User({
                  email: req.body.email,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  username: req.body.username,
                  password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                  });
            });
      });

router.route('/login')
      .post(async (req, res) => {
            // ADD VALIDATIONS
            const { username, password } = req.body;
            const user = await User.findOne({ username })
            if (!user) return res.status(404).json({ error: "Email not found" });
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                  const payload = { id: user.id, username: user.username };
                  jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: 31556926 },
                        (err, token) => {
                              res.json({
                                    success: true,
                                    token: "Bearer " + token
                              });
                        }
                  );
            } else {
                  return res.status(400).json({ error: "Password incorrect" });
            }
    });

const passport = require('passport');

router.route('/42')
      .get( passport.authenticate('42') );


      
router.route('/42/code')
      .post(async (req, res) => {
            try {
                  const payload = {
                        grant_type: 'authorization_code',
                        client_id: keys.FORTYTWO_APP_ID,
                        client_secret: keys.FORTYTWO_APP_SECRET,
                        code: req.body.code,
                        redirect_uri: 'http://localhost:3000/auth/42/callback'
                  };
                  const token42 = await axios.post('https://api.intra.42.fr/oauth/token', payload);
                  console.log(`access_token ${token42.data.access_token}`);
                  const authOptions = {
                        method: 'GET',
                        url: 'https://api.intra.42.fr/v2/me',
                        headers: {
                            'Authorization': `Bearer ${token42.data.access_token}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                  };
                  const user = await axios(authOptions);
                  console.log(user);

            } catch(err) {
                  console.log(err);
            }
      });




// router.get('/42/callback',
//       passport.authenticate('42', {
//           failureRedirect: 'http://localhost:' + port_front
//       }),
//       function(req, res) {
//           const user = req.session.passport.user;
//           if (user.err) {
//               res.cookie('err', "Email already use!", { maxAge: 1 * 1000, httpOnly: false});
//               res.redirect('http://localhost:' + port_front);
//           }
//           else {
//               const payload = {id: user.id, username: user.username, email: user.email};
//               const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: 86400 * 1000});
//               res.cookie('token', token, { maxAge: 86400 * 1000, httpOnly: false });
//               res.redirect('http://localhost:' + port_front + '/home');
//           }
//       }
//   );













module.exports = router;
