import bcrypt from "bcryptjs";
import prismaClient from "../../prisma/prismaClient";
import { FilterUser, PermissionsCreate, UserCreate, UserUpdated } from "../types/types";


const select = {
  id: true,
  email: true,
  name: true,
  role: true,
  caretedat: true,
};

class UserModel {
  constructor(private ormProvider = prismaClient) {}

  async create(user: UserCreate, permissions: PermissionsCreate) {
    const newUser = await this.ormProvider.user.create({
      select,
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
    await this.ormProvider.file.create({
      data: {
        name: `/home-${user.name}`,
        type: "DIRECTORY",
        isRoot: true,
        userId: newUser.id,
        permissions:{
          create:{
            delete: permissions.delete,
            read: permissions.red,
            share: permissions.share,
            write: permissions.write,
            userId: newUser.id
          }
        }
      },
    });
    return user;
  }

  findMany = async () => {
    return await this.ormProvider.user.findMany({
      select,
    });
  };

  findFirst = async ({ email, id }: FilterUser) => {
    return await this.ormProvider.user.findFirst({
      where: {
        email,
        id,
      },
    });
  };

  update = async (id: number, user: UserUpdated) => {
    return await this.ormProvider.user.update({
      where: {
        id,
      },
      select,
      data: user,
    });
  };

  delete = async (id: number) => {
    return await this.ormProvider.user.delete({
      where: {
        id,
      },
      select,
    });
  };

  encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

  comparePassword = async (password: string, receivePassword: string) => {
    return await bcrypt.compare(password, receivePassword);
  };
}

export default UserModel;
