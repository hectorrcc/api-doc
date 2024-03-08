import { object, string } from "yup";


export const AuthSchemaValidated = object({
    email: string()
    .email("The email is invalid")
    .required("The email is invalid"),
    password: string().required('The password is required')
})


