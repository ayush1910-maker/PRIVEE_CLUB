import Admin from "../models/Admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyAdminJWT = async (req, res, next) => {
  try {
    let token = null;

    // Extract token from cookies or Authorization header
    if (req.cookies?.adminAccessToken) {
      token = req.cookies.adminAccessToken;
    } else if (req.header("Authorization")) {
      const authHeader = req.header("Authorization");
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "").trim();
      }
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized: No admin token provided");
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      throw new ApiError(401, "Invalid admin token payload");
    }

    // Fetch admin from DB excluding password
    const admin = await Admin.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      throw new ApiError(401, "Admin not found");
    }

    req.admin = admin;
    next();

  } catch (err) {
    console.error("Admin JWT Verification Error:", err.message);
    return res.status(401).json({ status: false, message: err.message });
  }
};

export default verifyAdminJWT;
