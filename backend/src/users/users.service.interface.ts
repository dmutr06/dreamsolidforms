import { User } from "./user.interface";


export interface IUsersService {
    getUserById(id: string): User,    
}
