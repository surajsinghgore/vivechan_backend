import { Router } from "express";
import { getAllUser, getUserById, loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

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

// GET
router.route("/getAllUsers").get(verifyJWT,getAllUser);
router.route("/getUserById/:id").get(verifyJWT,getUserById);

export default router;
