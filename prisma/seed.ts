import prismaClient from "./prismaClient";
import bcrypt from "bcryptjs";

const encryptPass = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

async function main() {
 const admin = await prismaClient.user.upsert({
    where: { email: process.env.USER_EMAIL_ADMIN },
    update: {},
    create: {
      email: process.env.USER_EMAIL_ADMIN as string,
      name: process.env.USER_NAME_ADMIN as string,
      password: await encryptPass(process.env.USER_PASSWORD_ADMIN as string),
      role: "ADMIN",
      
    },
  });
  await prismaClient.file.create({
    data: {
      name: "/home-admin",
      type: "DIRECTORY",
      userId: admin.id,
      isRoot: true,
      permissions: {
        create: {
          delete: false,
          read: true,
          share: true,
          write: true,
          userId: admin.id,
        },
      },
    },
  });

  const creator = await prismaClient.user.upsert({
    where: { email: "creator@apidoc.com" },
    update: {},
    create: {
      name: "Creator",
      email: "creator@apidoc.com",
      password: await encryptPass("creator"),
      role: "CREATOR",
    },
  });
  await prismaClient.file.create({
    data: {
      name: "/home-creator",
      type: "DIRECTORY",
      userId: creator.id,
      isRoot: true,
      permissions: {
        create: {
          delete: false,
          read: true,
          share: true,
          write: true,
          userId: creator.id,
        },
      },
    },
  });
 const guest = await prismaClient.user.upsert({
    where: { email: "guest@apidoc.com" },
    update: {},
    create: {
      name: "Guest",
      email: "guest@apidoc.com",
      password: await encryptPass("guest"),
      role: "GUEST",
     
    },
  });
  await prismaClient.file.create({
    data: {
      name: "/home-guest",
      type: "DIRECTORY",
      userId: guest.id,
      isRoot: true,
      permissions: {
        create: {
          delete: false,
          read: false,
          share: false,
          write: false,
          userId: guest.id,
        },
      },
    },
  });

}
main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
