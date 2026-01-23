import express from "express";
import passport from "../utils/Passport.js";
import { generateAccessTokens } from "../controller/user.controller.js"; 
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    try {
      // Use existing token generator
      const { accessToken } = await generateAccessTokens(req.user.id);

      // Send JWT + user info
      res.json({ status: true, token: accessToken, user: req.user });
    } catch (err) {
      console.error("Token generation error:", err);
      res.status(500).json({ status: false, message: "Token generation failed" });
    }
  }
);

export default router;
