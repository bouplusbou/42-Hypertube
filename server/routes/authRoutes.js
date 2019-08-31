const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/UserModel");


// router.route('/')
//       .post((req,res) => { console.log(req.body) })

router.route('/')
      .get((req,res) => { console.log('YOLO') })

router.route('/login')
.post((req, res) => {
      console.log('here');
      User.findOne({ email: req.body.email })
            .then(user => {
            if (user) {
                  return res.status(400).json({ email: 'Email already exists' });
            } else {
                  const newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
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
            }
      });
});


module.exports = router;
