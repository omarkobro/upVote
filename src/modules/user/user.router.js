import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as userController from "./user.controller.js"
import { userSchema } from "./user.validationSchema.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { auth } from "../../middlewares/auth.middleware.js";


let router = Router()

router.post("/SignUp", validationMiddleware(userSchema) ,expressAsyncHandler(userController.signUp))
router.post("/login", expressAsyncHandler(userController.signIn))
router.put("/updateUser", auth(), expressAsyncHandler(userController.updateAccount))
router.delete("/deleteUser",auth(),  expressAsyncHandler(userController.deleteAccount))
router.get("/getUserInfo",auth(),  expressAsyncHandler(userController.getUserProfile))

export default router