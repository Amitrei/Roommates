import passport from "passport";
import dotenv from "dotenv";
import googleAuth from "passport-google-oauth";

import { userEntity as service } from "./../services/servicesManager.js";
const GoogleStrategy = googleAuth.OAuth2Strategy;
dotenv.config();

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  let user;
  try {
    user = await service.findOne({ _id: id }, "email", "roomId", "profilePicture");
  } catch (ex) {
    user = null;
  }

  done(null, user);
});

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      let user;

      try {
        user = await service.findOne({ googleId: profile.id });
      } catch (ex) {
        // if NotFound expection is thrown create a new one
        if (ex.name === "NotFoundError") {
          user = await service.create({
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos[0].value,
          });
        }
      }

      return done(null, user);
    }
  )
);
