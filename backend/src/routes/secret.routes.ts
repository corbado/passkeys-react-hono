import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";

const secretString = "Passkeys are cool!";

export default new Hono().get("/", requireAuth, (c) => {
    return c.json({ secret: secretString });
});
