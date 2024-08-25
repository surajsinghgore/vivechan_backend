import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import loginUser from "../handler/user/loginUser.handler.js";

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
