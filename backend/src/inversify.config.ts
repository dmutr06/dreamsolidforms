import { Container } from "inversify";
import { TYPES } from "./inversify.types";
import { App } from "./app";
import { Controller } from "./lib/controller";
import { UsersController } from "./users/users.controller";
import { FormsController } from "./forms/forms.controller";
import { IUsersService } from "./users/users.service.interface";
import { UsersService } from "./users/users.service";
import { IFormsService } from "./forms/forms.service.interface";
import { FormsService } from "./forms/forms.service";
import { UsersRepository } from "./users/users.repository";
import { FormsRepository } from "./forms/forms.repository";
import { PrismaService } from "./database/prisma.service";

const container = new Container();

container.bind(TYPES.App).to(App).inSingletonScope();
container.bind<Controller>(TYPES.UsersController).to(UsersController).inSingletonScope();
container.bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
container.bind<Controller>(TYPES.FormsController).to(FormsController).inSingletonScope();
container.bind<IFormsService>(TYPES.FormsService).to(FormsService).inSingletonScope();
container.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
container.bind<FormsRepository>(TYPES.FormsRepository).to(FormsRepository).inSingletonScope();
container.bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

export { container };
