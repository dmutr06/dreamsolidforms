import "reflect-metadata";
import { container } from "./inversify.config";
import { TYPES } from "./inversify.types";
import { App } from "./app";

async function main() {
    const app = container.get<App>(TYPES.App);

    app.run(6969);
}

main();
