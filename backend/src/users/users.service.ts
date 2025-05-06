import { injectable } from "inversify";
import { IUsersService } from "./users.service.interface";
import { User } from "./user.interface";

@injectable()
export class UsersService implements IUsersService {
    public getUserById(id: string): User {
        return { id, name: id };
    }
}
