import { User } from "../../models/User.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const getAllUserHandler = async (req, res, next) => {
  try {
    // Fetch all users except the password field
    const users = await User.find({}, '-password');

    if (!users || users.length === 0) {
      throw new ApiError(404, "No users found");
    }

    // Return success response
    return res.status(200).json(new ApiResponse(200, { users }, "Users fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export default getAllUserHandler;
