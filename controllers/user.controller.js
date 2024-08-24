import registerUserHandler from "../handler/user/registerUser.handler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(registerUserHandler);



export { registerUser };
