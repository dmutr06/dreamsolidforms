import "reflect-metadata";
import { container } from "./inversify.config";
import { TYPES } from "./inversify.types";
import { App } from "./app";

import { config } from "dotenv";

async function main() {
    config();
    const app = container.get<App>(TYPES.App);

    app.run(6969);
}

main();
