import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../config/db";

dotenv.config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload, done) => {
      try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [
          payload.id,
        ]);
        if (result.rowCount === 0) return done(null, false);
        return done(null, result.rows[0]);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
          return done(
            new Error("Email not available from Google profile"),
            false
          );
        }

        let result = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [googleId]
        );

        let user;

        if (result.rowCount === 0) {
          const insert = await pool.query(
            `INSERT INTO users (google_id, email, name, auth_provider)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [googleId, email, name, "google"]
          );
          user = insert.rows[0];
        } else {
          user = result.rows[0];
        }

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);