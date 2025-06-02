import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";
import { IUsersService } from "./users.service.interface";
import { TYPES } from "../inversify.types";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/createUser.dto";
import { User } from "../generated/prisma";
import { HttpError } from "../common/httpError";

@injectable()
export class UsersService implements IUsersService {
    constructor(@inject(TYPES.UsersRepository) private usersRepo: UsersRepository) {}

    public async getUserById(id: string) {
        return this.usersRepo.getUserById(id);
    }
    
    public async createUser(userDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);

        const user = await this.usersRepo.createUser({ name: userDto.name, password: hashedPassword });

        if (!user) throw new HttpError(400, "User with such name already exists");

        return user;
    }

    public async signIn(user: User): Promise<string> {
        return jwt.sign({ id: user.id }, process.env.SECRET!, { expiresIn: "1h" });
    }

    public async verifyUser(userDto: CreateUserDto): Promise<User> {
        const user = await this.usersRepo.getUserByName(userDto.name);
        if (!user) throw new HttpError(400, "User doesn't exist");

        if (await bcrypt.compare(userDto.password, user.password))
            return user;
        
        throw new HttpError(400, "Bad name or password");
    }
}
