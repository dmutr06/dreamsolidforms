import initDb from "better-sqlite3";
import { readdirSync, readFileSync } from "fs";
import path from "path";

const db = initDb("data.db");

const hasMigrationTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'").get();

if (!hasMigrationTable) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS migrations (
            name TEXT NOT NULL UNIQUE
        )
    `).run();

    console.log("Created migrations table");
}

const appliedMigrations = new Set(
    db.prepare<[], { name: string }>("SELECT name FROM migrations")
        .all()
        .map(row => row.name)
);

const migrations = readdirSync("migrations")
    .filter(file => file.endsWith(".sql"))
    .sort();

for (const file of migrations) {
    if (appliedMigrations.has(file)) continue;

    const migration = readFileSync(path.join("migrations", file), "utf-8");

    const transaction = db.transaction(() => {
        db.exec(migration);
        db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
    });

    try {
        transaction();
        console.log(`Applied ${file}`);
    } catch (err) {
        console.error(`Error applying ${file}: ${(err as Error).message}`);
        process.exit(1);
    }
}
