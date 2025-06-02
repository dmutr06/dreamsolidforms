import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.types";
import { Prisma, User } from "../generated/prisma";
import { CreateUserDto } from "./dto/createUser.dto";
import { PrismaService } from "../database/prisma.service";
import { HttpError } from "../common/httpError";

@injectable()
export class UsersRepository {
    private readonly user: Prisma.UserDelegate;
    constructor(@inject(TYPES.PrismaService) private db: PrismaService) {
        this.user = this.db.client.user;
    }

    public async getUserById(id: string): Promise<User | null> {
        return this.user.findUnique({ where: { id } });
    }

    public async getUserByName(name: string): Promise<User | null> {
        return this.user.findUnique({ where: { name } });
    }

    public async createUser(userDto: CreateUserDto): Promise<User> {
        if (await this.getUserByName(userDto.name)) 
            throw new HttpError(400, "User with such name already exists");

        return this.user.create({ data: userDto });
    }
}
