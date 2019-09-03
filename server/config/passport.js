const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const keys = require("../config/keys");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};

const FortyTwoStrategy = require('passport-42').Strategy;
const passport = require('passport');

passport.use(
  new FortyTwoStrategy({
    clientID: keys.FORTYTWO_APP_ID,
    clientSecret: keys.FORTYTWO_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/42/callback",
    profileFields: {
      'id': function (obj) { return String(obj.id); },
      'username': 'login',
      'displayName': 'displayname',
      'name.familyName': 'last_name',
      'name.givenName': 'first_name',
      'profileUrl': 'url',
      'emails.0.value': 'email',
      'phoneNumbers.0.value': 'phone',
      'photos.0.value': 'image_url'
    }
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log('COUCOU');
    // User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
    //   console.log('ZOOOOO');
    //   return cb(err, user);
    // });
  }
));