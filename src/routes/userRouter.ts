import { Router } from "express";
import UserController from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const userController = new UserController();
export const UserRouter = Router();

UserRouter.post("/", [verifyToken], userController.create);
UserRouter.get("/", [verifyToken], userController.getUser);
UserRouter.put("/", [verifyToken], userController.update);
UserRouter.delete("/", [verifyToken], userController.delete);

export default UserRouter;
 