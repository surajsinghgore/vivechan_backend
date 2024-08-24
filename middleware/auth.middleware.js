import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);

    // Retrieve user from the database
    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized request: User not found");
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    // Handle errors related to token verification or user retrieval
    const errorMessage = error instanceof jwt.JsonWebTokenError ? "Invalid access token" : error.message || "Unauthorized request";
    throw new ApiError(401, errorMessage);
  }
});
