import { Type } from "@prisma/client";
import { number, object, string } from "yup";

export const NewFileSchemaValidate = object({
    name: string().required(" The name is required"),
    type: string<Type>().required("The type es riquired"),
    parentId: number().required("The parentId is reqiured"),
    userId: number().required('The userId is required') 
})