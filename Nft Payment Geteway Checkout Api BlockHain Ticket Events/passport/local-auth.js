const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const Roles = require("../models/Role");
const jwt = require("jsonwebtoken");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = User.findById(id);
  done(null, user);
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const found = await User.findOne({ username });
        if (found) {
          return done(null, false, { message: "USER IS ALREADY REGISTERED" });
        }
       
  
        const user = new User({
          username,
          password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          profilePic: req.body.profilePic ? req.body.profilePic : "",
          token : '',
        });
        const body = { _id: user._id, username: username };
        const token = jwt.sign({ user: body }, "superstringinhackeable");
        user.token = token
        if (req.body.roles) {
          const rol = await Roles.find({ name: { $in: req.body.roles } });
          user.roles = rol.map((role) => role._id);
        } else {
          const foundRoles = await Roles.findOne({ name: "user" });
          user.roles = [foundRoles._id];
        }
        await user.save();
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    // //const userFound = await User.findOne({ email: req.body.email }).populate(
    //     "roles"
    //     );
    async (_req, username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          done(null, false, {message: "USER NOT FOUND"});
        }
        const validate = await user.validatePassword(password);
        if (!validate) {
          done(null, false, { message: "WRONG PASSWORD" });
        }
        done(null, user, { message: "SUCCESS" });
      } catch (error) {
        done(error);
      }
    }
  )
);
