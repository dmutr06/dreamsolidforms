import { injectable } from "inversify";
import { PrismaClient } from "../generated/prisma";


@injectable()
export class PrismaService {
    public readonly client: PrismaClient;
    constructor() {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
        } catch (e) {
            console.log(e);
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
