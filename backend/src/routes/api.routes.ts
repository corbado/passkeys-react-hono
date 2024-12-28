import { Hono } from "hono";
import secretRoutes from "./secret.routes.js";
import userRoutes from "./user.routes.js";

export default new Hono()
    .route("/secret", secretRoutes)
    .route("/user", userRoutes);
