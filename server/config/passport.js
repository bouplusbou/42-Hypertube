// const mongoose = require("mongoose");
// const User = mongoose.model("User");
// const keys = require("../config/keys");
// const FortyTwoStrategy = require('passport-42').Strategy;
// const passport = require('passport');

// passport.serializeUser(function(user, done) {
//  done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//  done(null, user);
// });

// passport.use(
//   new FortyTwoStrategy({
//     clientID: keys.FORTYTWO_APP_ID,
//     clientSecret: keys.FORTYTWO_APP_SECRET,
//     callbackURL: "http://localhost:5000/api/auth/42/callback",
//     profileFields: {
//       'id': function (obj) { return String(obj.id); },
//       'username': 'login',
//       'displayName': 'displayname',
//       'name.familyName': 'last_name',
//       'name.givenName': 'first_name',
//       'profileUrl': 'url',
//       'emails.0.value': 'email',
//       'phoneNumbers.0.value': 'phone',
//       'photos.0.value': 'image_url'
//     }
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     // VERIFY IF USER EXISTS, IF NOT CREATE IT BASED ON fortytwoId
//     console.log(profile);
//     try {
//       const userExists = await User.findOne({ fortyTwoId: profile.id }); 
//       if (userExists) {
//         // console.log("user already exists");
//         // console.log(userExists);
//         // check if email changed ?? why ?
//       } else {
//         const user = { 
//           fortyTwoId: profile.id,
//           fortyTwoEmail: profile.emails[0].value,
//         };
//         let newUser = new User(user);
//         User.collection.insertOne(newUser)
//         .then((data)=>{
//           resolve(data);
//         }).catch((err)=>{
//           reject(err);
//         })
//       }
//     } catch(err) {
//       console.log(err);
//     }






//     // User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
//     //   return done(err, user);
//     // });
//     // const userData = { 
//     //   mongoId: ???
//     // }
//     // return done(null, userData);
//   }
// ));


