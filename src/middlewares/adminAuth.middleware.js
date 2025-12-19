import Admin from "../models/Admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyAdminJWT = async (req, res, next) => {
  try {
    let token = null;

    // From cookies
    if (req.cookies?.adminAccessToken) {
      token = req.cookies.adminAccessToken;
    }
    // From header
    else if (req.header("Authorization")) {
      const authHeader = req.header("Authorization");
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "").trim();
      }
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized: Admin token required");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.id) {
      throw new ApiError(401, "Invalid admin token");
    }

    const admin = await Admin.findByPk(decodedToken.id, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      throw new ApiError(401, "Admin not found");
    }

    req.admin = admin;
    next();

  } catch (err) {
    console.error("Admin JWT Error:", err.message);
    return res
      .status(401)
      .json({ status: false, message: err.message });
  }
};

export default verifyAdminJWT;
