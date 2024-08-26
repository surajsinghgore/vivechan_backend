import { User } from "../../models/User.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const getUserByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find user by ID, excluding the password field
    const user = await User.findById(id, '-password');

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Return success response
    return res.status(200).json(new ApiResponse(200, { user }, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export default getUserByIdHandler;
