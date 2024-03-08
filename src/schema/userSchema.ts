import { Role } from "@prisma/client";
import { number, object, string } from "yup";

export const NewUserSchemaValidate = object({
  name: string().required("The name is required"),
  email: string()
    .email("The email is invalid")
    .required("The email is invalid"),
  password: string().required("The password is required"),
  role: string<Role>().default(()=> Role.GUEST),
});

export const UpdateUserSchemaValidate = object({
  id: number().required('The id is required'),
  name: string(),
  role: string<Role>()
})

export const DeleteUserScheaValidate = object({
  id: number().required('The id is required'),
})