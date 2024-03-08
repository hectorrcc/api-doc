import { Router } from "express";
import AuthController from "../controllers/authController";


const authController = new AuthController()
export const AuthRouter = Router()

AuthRouter.post('/login',authController.login)
