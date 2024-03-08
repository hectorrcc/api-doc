import { Request, Response } from "express";
import {
  DeleteUserScheaValidate,
  NewUserSchemaValidate,
  UpdateUserSchemaValidate,
} from "../schema";
import UserModel from "../models/userModel";
import { MessagesError, PermissionsCreate, UserCreate, UserUpdated } from "../types/types";

class UserController {
  constructor(private userModel = new UserModel()) {}

  create = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body as UserCreate;
    let userValidated;
    let permissions: PermissionsCreate ={
      delete: false,
      red: false,
      share: false,
      write: false
    }

    if (role === "ADMIN" || role === "CREATOR") {
      permissions = {
        delete: true,
      red: true,
      share: true,
      write: true
      }
    }

    try {
      userValidated = await NewUserSchemaValidate.validate({
        name,
        email,
        password,
        role,
      }) as UserCreate;

      userValidated.password = await this.userModel.encryptPassword(userValidated.password)
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }

    try {
      const user = await this.userModel.create(userValidated, permissions);
      return res.status(201).json({ message: "ok", user });
    } catch (error) {
      console.log("Error aqui", error);
      return res.status(500).json({ message: MessagesError.ERROR_USER_CREATING });
    }
  };

  getUser = async (_req: Request, res: Response) => {
    try {
      const users = await this.userModel.findMany();
      return res.status(200).json({ message: "ok", users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: MessagesError.ERROR_USER_GETTING});
    }
  };

  update = async (req: Request, res: Response) => {
    const { id, name, role } = req.body;
    let userValidated;

    try {
      userValidated = await UpdateUserSchemaValidate.validate({
        id,
        name,
        role,
      }) as UserUpdated;
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }

    try {
      const user = await this.userModel.update(userValidated.id, userValidated );
      return res.status(200).json({ message: "ok", user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: MessagesError.ERROR_USER_UPDATING });
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.body;
    let idValidated;

    try {
      idValidated = await DeleteUserScheaValidate.validate({ id });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }

    try {
      const user = await this.userModel.delete(idValidated.id);
      return res.status(200).json({ message: "ok", user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: MessagesError.ERROR_USER_DELETING });
    }
  };
}

export default UserController;
