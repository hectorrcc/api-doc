
type Rol = 'admin' | 'creator' | 'guest'
interface User{
    id: string,
    name: string
    email:string
    password: string
    rol: Rol
}