import type { Hono as HonoApplication } from "hono";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { compress } from "hono/compress";
import { authenticationMiddleware } from "./middleware/auth.js";
import indexRoutes from "./routes/index.js";
import { cors } from "hono/cors";

class App {
    public readonly app: HonoApplication;

    constructor() {
        this.app = new Hono();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    public listen() {
        const port = Number(process.env.PORT) || 3001;
        console.log(`Server is running on http://localhost:${port}`);
        serve({
            fetch: this.app.fetch,
            port,
        });
    }

    private initializeMiddlewares() {
        this.app.use(logger());
        this.app.use(compress());
        this.app.use(
            cors({
                origin: "http://localhost:3000",
                credentials: true,
                allowHeaders: ["Content-Type", "Authorization"],
                allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            }),
        );
        this.app.use(authenticationMiddleware);
    }

    private initializeRoutes() {
        this.app.route("/", indexRoutes);
    }
}

export default new App();
