import { inject, injectable } from "inversify";
import { createId } from "@paralleldrive/cuid2";
import { TYPES } from "../inversify.types";
import { Database } from "../database/database.interface";
import { User } from "./user.interface";
import { CreateUserDto } from "./dto/createUser.dto";

@injectable()
export class UsersRepository {
    constructor(@inject(TYPES.Database) private db: Database) {}

    public async getUserById(id: string): Promise<User | null> {
        const res = await this.db.query<User>("SELECT * FROM users WHERE id = ?", [id]);

        if (!res || res.length == 0) return null;

        return res[0];
    }

    public async createUser(userDto: CreateUserDto): Promise<User | null> {
        const user: User = { ...userDto, id: createId() };

        if (await this.db.run("INSERT INTO users (id, name, password) VALUES (?, ?, ?)", [user.id, user.name, user.password]))
            return user;
        else 
            return null;
    }

    public async getUserByName(name: String): Promise<User | null> {
        const res = await this.db.query<User>("SELECT * FROM users WHERE name = ?", [name]);

        if (!res || res.length == 0) return null;

        return res[0];
    }
}
