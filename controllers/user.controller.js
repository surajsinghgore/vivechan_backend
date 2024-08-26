import getAllUserHandler from "../handler/user/getAllUsers.handler.js";
import loginUserHandler from "../handler/user/loginUser.handler.js";
import registerUserHandler from "../handler/user/registerUser.handler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(registerUserHandler);
const loginUser = asyncHandler(loginUserHandler);
const getAllUser = asyncHandler(getAllUserHandler);



export { registerUser,loginUser ,getAllUser};
