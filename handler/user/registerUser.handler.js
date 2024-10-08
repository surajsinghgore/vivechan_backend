import { User } from "../../models/User.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs"; // Import fs module
import path from "path"; // Import path module

const allowedGenders = ["male", "female", "other"];

// Function to delete a file
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete local file:", err);
    }
  });
};

const registerUserHandler = async (req, res, next) => {
  let profileLocalPath;

  try {
    const { email, username, password, gender, dob, bio } = req.body;

    const missingFields = [];
    if (!email || email.trim() === "") missingFields.push("email");
    if (!username || username.trim() === "") missingFields.push("username");
    if (!password || password.trim() === "") missingFields.push("password");
    if (!gender || gender.trim() === "") missingFields.push("gender");
    if (!dob || dob.trim() === "") missingFields.push("dob");
    if (!bio || bio.trim() === "") missingFields.push("bio");

    if (missingFields.length > 0) {
      throw new ApiError(400, `The following fields are required: ${missingFields.join(", ")}`);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    if (!passwordRegex.test(password)) {
      throw new ApiError(400, "Password must be at least 5 characters long, contain one uppercase letter, one number, and one special character");
    }

    // Username length validation
    if (username.length < 3) {
      throw new ApiError(400, "Username must be at least 3 characters long");
    }

    // Bio length validation
    if (bio.length < 10) {
      throw new ApiError(400, "Bio must be at least 10 characters long");
    }

    // Gender validation
    if (!allowedGenders.includes(gender.toLowerCase())) {
      throw new ApiError(400, `Invalid gender. Allowed values are: ${allowedGenders.join(", ")}`);
    }

    // Check for profile image
    profileLocalPath = req.files?.profile?.[0]?.path;
    if (!profileLocalPath) {
      throw new ApiError(400, "Profile image file is required");
    }

    // Check if user already exists: username, email
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      deleteFile(profileLocalPath); // Remove file if user exists
      throw new ApiError(409, "User with email or username already exists");
    }

    // Upload profile image to Cloudinary
    const profile = await uploadOnCloudinary(profileLocalPath);
    if (!profile) {
      deleteFile(profileLocalPath); // Remove file if upload fails
      throw new ApiError(500, "Failed to upload profile image");
    }

    // Remove the local file after successful upload
    fs.unlink(profileLocalPath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      }
    });

    // Create user object and save in the database
    const user = await User.create({
      profile: profile.url,
      email,
      password,
      username: username.toLowerCase(),
      gender,
      dob,
      bio,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    // Ensure the file is removed if an error occurs
    if (profileLocalPath) {
      deleteFile(profileLocalPath);
    }
    next(error);
  }
};

export default registerUserHandler;
