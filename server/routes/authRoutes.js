const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/UserModel");

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


module.exports = router;
