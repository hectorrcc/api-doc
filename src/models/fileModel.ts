import prismaClient from "../../prisma/prismaClient";
import {
  FileCreate,
  PermissionsCreate,
  UpdatedPermissions,
  WhereFile,
} from "../types/types";

class FileModel {
  constructor(private ormProvider = prismaClient) {}

  create = async (file: FileCreate, permissions: PermissionsCreate) => {
    if (file.type === "DIRECTORY") {
    }
    return await this.ormProvider.file.create({
      data: {
        name: file.name,
        type: file.type,
        parent: {
          connect: {
            id: file.parentId as number,
          },
        },
        creator: {
          connect: {
            id: file.userId,
          },
        },
        permissions: {
          create: {
            delete: permissions.delete,
            read: permissions.red,
            share: permissions.share,
            write: permissions.write,
            userId: file.userId,
          },
        },
      },
    });
  };

  findUnique = async (where: WhereFile) => {
    return await this.ormProvider.file.findUnique({
      where: {
        id: where.id,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        type: true,
        parentId: true,
        isRoot: true,
        createdAt: true,
        children: {
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
          },
        },
        permissions: {
          where: { userId: where.userId },
          select: {
            id: true,
            read: true,
            write: true,
            share: true,
            delete: true,
          },
        },
      },
    });
  };

  delete = async (where: WhereFile) => {
    return await this.ormProvider.file.delete({ where });
  };

  updatePermissions = async (data: UpdatedPermissions) => {
    return this.ormProvider.permissions.upsert({
      where: {
        id: data.permissionId,
      },
      update: {
        read: data.permissions.red,
        delete: data.permissions.delete,
        share: data.permissions.share,
        write: data.permissions.write,
      },
      create: {
        fileId: data.fileId,
        userId: data.userId,
        read: data.permissions.red,
        delete: data.permissions.delete,
        share: data.permissions.share,
        write: data.permissions.write,
      },
    });
  };
}

export default FileModel;
