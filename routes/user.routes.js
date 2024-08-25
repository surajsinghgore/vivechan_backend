import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

// Register
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profile",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

export default router;
