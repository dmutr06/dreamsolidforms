import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";
import { IUsersService } from "./users.service.interface";
import { TYPES } from "../inversify.types";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/createUser.dto";

@injectable()
export class UsersService implements IUsersService {
    constructor(@inject(TYPES.UsersRepository) private usersRepo: UsersRepository) {}

    public async getUserById(id: string) {
        return this.usersRepo.getUserById(id);
    }
    
    public async createUser(user: CreateUserDto): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        return this.usersRepo.createUser({ name: user.name, password: hashedPassword });
    }
}
