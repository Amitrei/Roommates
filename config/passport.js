import passport from "passport";
import dotenv from "dotenv";
import iconvLite from "iconv-lite";

dotenv.config();
import googleAuth from "passport-google-oauth";
const GoogleStrategy = googleAuth.OAuth2Strategy;
import { userEntity as service } from "./../services/servicesManager.js";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      const myProfile = { ...profile };
      // const someEncodedString = Buffer.from("moshe", "utf-8");
      service.create({ name: "a" }).then((currentUser) => {
        done(null, currentUser);
      });

      // return done(null, profile);
    }
  )
);
