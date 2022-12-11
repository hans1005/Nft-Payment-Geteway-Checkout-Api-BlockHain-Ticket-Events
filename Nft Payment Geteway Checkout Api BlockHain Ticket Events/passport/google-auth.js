require('dotenv').config();
const passport = require('passport');
const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Roles = require('../models/Role');

const jwt = require("jsonwebtoken");

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8001/auth/google/callback"
    },
    async (_accessToken, _refreshToken, profile, done) => {
        try {
            const user = await User.findOne({googleID : profile.id}); // si el usuario no existe 
            if (!user) {
              let newUser = new User();
              newUser.username = profile.emails[0].value
              newUser.googleID = profile.id
              newUser.firstName = profile.name.givenName
              newUser.lastName = profile.name.familyName
              newUser.profilePic = profile.photos[0].value
              const token = jwt.sign({ googleID: profile.id}, "superstringinhackeable");
              newUser.token = token;
              const foundRoles = await Roles.findOne({ name: "user" });
              newUser.roles = [foundRoles._id];
              await newUser.save() //guardamos en la base de datos
              return done(null, newUser)
            }
            const token = jwt.sign({ googleID: profile.id}, "superstringinhackeable");
            user.token = token;
            await user.save()
            return done(null, user);
            

        } catch (error) {
            done(error);
        
      }
    }
  )
);