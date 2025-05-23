import { injectable } from "inversify";
import initDb from "better-sqlite3";
import { Database } from "./database.interface";
import { HttpError } from "../common/httpError";


@injectable()
export class SqliteDatabase implements Database {
    private db!: initDb.Database;

    async connect(): Promise<void> {
        this.db = initDb("data.db"); 
        this.db.pragma("journal_mode = WAL");
    }

    async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
        if (!this.db) await this.connect();

        try {
            return this.db.prepare(sql).all(params) as T[]; 
        } catch (e) {
            console.log(e);
            throw new HttpError(500, "Internal server error");
        }
    }

    async run(sql: string, params: unknown[] = []): Promise<boolean> {
        if (!this.db) await this.connect();

        try {
            this.db.prepare(sql).run(params);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
