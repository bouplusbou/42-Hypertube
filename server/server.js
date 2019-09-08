const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const server = require('http').createServer(app);
const passport = require("passport");
const keys = require("./config/keys");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;


app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api', router);


passport.serializeUser(function(user, done) {
    done(null, user);
});
   
passport.deserializeUser(function(user, done) {
    done(null, user);
});




passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const userExists = await User.findOne({ googleId: profile.id });
      if (userExists) {
        // console.log('user already exists');
        // console.log(userExists._id);
        return done(null, userExists._id);
      } else {
        // DL photo to cloudinary and put URL
        const user = { 
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          username: profile.name.givenName+profile.name.familyName,
          // photo: profile.photos[0].value
        };
        let newUser = new User(user);
        const data = await User.collection.insertOne(newUser)
        if (data) {
          return done(null, data.insertedId);
        } 
      }
    } catch(err) {
      console.log(err);
    }
  }
));

passport.use(
    new FortyTwoStrategy({
      clientID: keys.FORTYTWO_APP_ID,
      clientSecret: keys.FORTYTWO_APP_SECRET,
      callbackURL: "http://localhost:5000/api/auth/42/callback",
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

    async (accessToken, refreshToken, profile, done) => {
      try {
          const userExists = await User.findOne({ fortyTwoId: profile.id });
          if (userExists) {
              return done(null, userExists._id);
          } else {
              // DL photo to cloudinary and put URL
              const user = { 
                  fortyTwoId: profile.id,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  username: profile.username,
                  // photo: profile.photos[0].value
              };
              let newUser = new User(user);
              const data = await User.collection.insertOne(newUser)
              if (data) {
                  return done(null, data.insertedId);
              } 
          }
      } catch(err) {
        console.log(err);
      }
    }
));




async function connectMongo() {
    const MONGO_URI = require("./config/keys").MONGO_URI;
    const mongoose = require("mongoose");
    mongoose.set('useFindAndModify', false);
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        console.log("MongoDB successfully connected");
    } catch(err) { console.log(err); }
}
connectMongo();

const port = 5000;
server.listen(port, () => `Server running on port ${port}`);