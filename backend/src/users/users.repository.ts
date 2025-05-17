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

    public async createUser(user: CreateUserDto): Promise<boolean> {
        return await this.db.run("INSERT INTO users (id, name, password) VALUES (?, ?, ?)", [createId(), user.name, user.password]);
    }
}
