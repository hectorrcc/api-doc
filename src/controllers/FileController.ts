import { Request, Response } from "express";
import {
  FileCreate,
  MessagesError,
  PermissionsCreate,
  UpdatedPermissions,
  WhereFile,
} from "../types/types";
import FileModel from "../models/fileModel";
import { NewFileSchemaValidate } from "../schema";
import UserModel from "../models/userModel";


class FileController {
  constructor(
    private fileModel = new FileModel(),
    private userModel = new UserModel()
  ) {}

  create = async (req: Request, res: Response) => {
    let { name, parentId, type } = req.body as FileCreate;
    const userId = req.userId as number;
    const role = req.userRole;
    const where: WhereFile = {
      id: parentId as number,
      userId,
    };
    let permissions: PermissionsCreate = {
      delete: false,
      red: false,
      share: false,
      write: false,
    };

    type === "DIRECTORY" ? (name = "/" + name) : name;

    try {
      const fileValidated = (await NewFileSchemaValidate.validate({
        name,
        parentId,
        type,
        userId,
      })) as FileCreate;
      const parentDirectory = await this.fileModel.findUnique(where);

      if (parentDirectory == null) {
        throw new Error(MessagesError.ERROR_FILE_PARENT_EXIST);
      }
      if (parentDirectory?.type !== "DIRECTORY") {
        throw new Error(MessagesError.ERROR_FILE_PARENT_EXIST);
      }
      if (role !== "ADMIN") {
        if (
          parentDirectory?.permissions.length == 0 ||
          !parentDirectory?.permissions[0].write
        ) {
          throw new Error(MessagesError.ERROR_FILE_PRIVILEGE);
        }
      }

      if (role === "ADMIN" || role === "CREATOR") {
        permissions = {
          delete: true,
          red: true,
          share: true,
          write: true,
        };
      }
      const file = await this.fileModel.create(fileValidated, permissions);
      return res.status(201).json({ messaje: "ok", file });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getFile = async (req: Request, res: Response) => {
    const { documentId } = req.body;
    const userId = req.userId;
    const role = req.userRole;
    const where: WhereFile = {
      id: documentId as number,
      userId,
    };
    try {
      const file = await this.fileModel.findUnique(where);

      if (role !== "ADMIN") {
        if (file?.permissions.length == 0 || !file?.permissions[0].read) {
          throw new Error(MessagesError.ERROR_FILE_PRIVILEGE);
        }
      }
      return res.status(200).json({ message: "ok", file });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  delete = async (req: Request, res: Response) => {
    const { documentId } = req.body;
    const userId = req.userId;
    const role = req.userRole;
    const where: WhereFile = {
      id: documentId as number,
      userId,
    };

    try {
      const file = await this.fileModel.findUnique(where);

      if (file === null) {
        throw new Error(MessagesError.ERROR_FILE_EXIST);
      }
      if (file.isRoot) {
        throw new Error(MessagesError.ERROR_FILE_ROOT);
      }
      if (role !== "ADMIN") {
        if (file?.permissions.length == 0 || !file?.permissions[0].delete) {
          throw new Error(MessagesError.ERROR_FILE_PRIVILEGE);
        }
      }
      await this.fileModel.delete(where);
      return res.status(200).json({ message: "ok" });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  share = async (req: Request, res: Response) => {
    const { documentId, userIdShare, red, write, share, del, recursivo } = req.body;
    const userId = req.userId;
    const role = req.userRole;
    let where: WhereFile = {
      id: documentId,
      userId: userId,
    };

    try {
      const userShare = await this.userModel.findFirst({ id: userIdShare });
      if (userShare === null) {
        throw new Error(MessagesError.ERROR_USER_GETTING);
      }
      let file = await this.fileModel.findUnique(where);
      if (file === null) {
        throw new Error(MessagesError.ERROR_FILE_EXIST);
      }
      if (role !== "ADMIN") {
        if (
          file?.permissions.length == 0 ||
          !file?.permissions[0].share ||
          role === "GUEST"
        ) {
          throw new Error(MessagesError.ERROR_FILE_PRIVILEGE);
        }
      }

      where = {
        id: documentId,
        userId: userIdShare,
      };
      file = await this.fileModel.findUnique(where);

      const updateData: UpdatedPermissions = {
        permissionId:
          file !== null && file.permissions.length > 0
            ? file?.permissions[0].id
            : 0,
        fileId: documentId,
        userId: userIdShare,
        permissions: {
          delete: del,
          red,
          share: userShare.role === "GUEST" ? false : share,
          write,
        },
      };
      if (recursivo) {
       await  this.permissonsRecursivo(updateData)
      }
      else{
        await this.fileModel.updatePermissions(updateData);
      }
     
      return res.status(200).json({ message: "ok" });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  permissonsRecursivo = async (updateData: UpdatedPermissions) => {
    const where = {
      id: updateData.fileId,
      userId: updateData.userId,
    };

    const file = await this.fileModel.findUnique(where);

    if (file?.type !== "DIRECTORY") {
      return;
    }
    await this.fileModel.updatePermissions(updateData);
    file.children.forEach(async (file) => {
      const query: WhereFile = { ...where, id: file.id };
      const newFile = await this.fileModel.findUnique(query);

      const newUpdateData: UpdatedPermissions = {
        ...updateData,
        permissionId:
          newFile !== null && newFile.permissions.length > 0
            ? newFile?.permissions[0].id
            : 0,
        fileId: newFile?.id as number    
      };
      await this.permissonsRecursivo(newUpdateData)
    });
  };
}

export default FileController;
