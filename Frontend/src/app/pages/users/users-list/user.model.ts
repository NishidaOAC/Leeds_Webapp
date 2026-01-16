import { Role } from "../role-list.component/role.model"

export interface User{
    id: number
    name: string,
    userName: string,
    password: string
    roleId: number
    role: Role
    email: string
}