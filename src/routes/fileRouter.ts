import { Router } from "express";
import FileController from "../controllers/FileController";
import { verifyToken } from "../middleware/authMiddleware";

const fileController = new FileController();
export const FileRouter = Router();

FileRouter.post("/", [verifyToken], fileController.create);
FileRouter.get("/", [verifyToken], fileController.getFile)
FileRouter.delete("/",[verifyToken], fileController.delete)
FileRouter.put("/", [verifyToken], fileController.share)
