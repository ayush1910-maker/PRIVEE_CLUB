import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        // 1️⃣ Try find by googleId
        let user = await User.findOne({
          where: { googleId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        // 2️⃣ Try find by email (MERGE CASE)
        user = await User.findOne({
          where: { email },
        });

        if (user) {
          // attach googleId to existing account
          user.googleId = profile.id;

          // ensure password is null for google users
          user.password = null;

          await user.save();
          return done(null, user);
        }

        // 3️⃣ Create new Google user
        user = await User.create({
          googleId: profile.id,
          email,
          profile_name: profile.displayName,
          password: null, // 🔐 disable password login
        });

        return done(null, user);
      } catch (err) {
        console.error("GOOGLE AUTH ERROR 👉", err);
        return done(err, null);
      }
    }
  )
);

// Not required for JWT auth but safe to keep
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
