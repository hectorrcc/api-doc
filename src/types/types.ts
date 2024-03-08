import { File, Role, User } from "@prisma/client";

export type WhereUser = {
  id?: number;
  name?: string;
  email?: string;
};

export type FilterUser = {
  id?: number;
  email?: string;
};

export type WhereFile = {
  id: number;
  userId?: number;
};

export type PermissionsCreate ={
  write: boolean,
  red: boolean,
  delete: boolean,
  share: boolean
}

export type UpdatedPermissions ={
  permissionId?: number
  userId: number,
  fileId: number
  permissions:PermissionsCreate
}

export enum MessagesError {
  //ERRORS MESSAGES AUTH
  UNAUTHORIZED = "unauthorized",
  NO_TOKEN_PROVIDER = "No token provider",
  //ERRORS MESSAGES USERS
  ERROR_USER_CREATING = "Error creating user",
  ERROR_USER_GETTING = "Error getting users",
  ERROR_USER_UPDATING = "Error updating user",
  ERROR_USER_DELETING = "Error deleting user",
  //ERRORS MESSAGES FILES
  ERROR_FILE_PARENT_EXIST = "The parent element does not exist",
  ERROR_FILE_PARENT_DIRECTORY = "The Parent element is not a directory",
  ERROR_FILE_EXIST = "The file or directory does not exits",
  ERROR_FILE_PRIVILEGE = "No privileges to execute this action",
  ERROR_FILE_ROOT = "Can't delete root directory",
}

export interface UserCreate extends Omit<User, "id" | "createdAt"> {}
export interface UserUpdated extends Omit<User, "password"  | "createdAt" | "email">{}
export interface FileCreate extends Omit<File, "id" | "createdAt"> {}

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
    userRole?: Role;
  }
}
