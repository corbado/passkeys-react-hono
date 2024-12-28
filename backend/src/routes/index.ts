import { Hono } from "hono";
import apiRoutes from "./api.routes.js";

export default new Hono().route("/api", apiRoutes);
