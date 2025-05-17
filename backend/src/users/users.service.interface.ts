import { CreateUserDto } from "./dto/createUser.dto";
import { User } from "./user.interface";


export interface IUsersService {
    getUserById(id: string): Promise<User | null>,    
    createUser(user: CreateUserDto): Promise<boolean>,
}
