import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    let token = null;

    // Extract token from cookies or Authorization header
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.header("Authorization")) {
      const authHeader = req.header("Authorization");
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "").trim();
      }
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.id || decodedToken.token_version === undefined) {
      throw new ApiError(401, "Invalid token payload");
    }

    
    const dbUser = await User.findByPk(decodedToken.id, {
      attributes: { exclude: ["password"] },
    });

    if (!dbUser) {
      throw new ApiError(400, "Customer not found or invalid token");
    }

    
    if (decodedToken.token_version !== dbUser.token_version) {
      throw new ApiError(401, "Token is no longer valid. Please login again.");
    }

    req.user = dbUser;
    next();

  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ status: false, message: err.message });
  }
};

export default verifyJWT;