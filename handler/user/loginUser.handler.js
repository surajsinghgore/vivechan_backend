import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

const JWT_SECRET = process.env.JWT_TOKEN_KEY ;
const JWT_EXPIRATION = process.env.JWT_TOKEN_EXPIRY;

const loginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate request
    if (!username && !email) {
      throw new ApiError(400, "Username or email is required");
    }
    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (!user) {
      throw new ApiError(401, "Invalid username or email");
    }

    // Verify password
    const isMatch =await user.isPasswordCorrect(password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return success response
    return res.status(200).json(new ApiResponse(200, { token, user }, "Login successful"));
  } catch (error) {
    next(error);
  }
};



export default loginUser;
