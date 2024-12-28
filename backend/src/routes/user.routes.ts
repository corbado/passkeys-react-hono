import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { getUser, insertUser, updateUserCity } from "../db/queries.js";
import { getUserIdentifiers } from "../utils/authentication.js";
import assert from "node:assert";
import { HTTPException } from "hono/http-exception";

export default new Hono()
    .get("/", requireAuth, async (c) => {
        const user = c.get("user");
        assert(
            user,
            "User is not defined. Use authentication middleware to protect this route.",
        );
        let dbUser = getUser(user.userId);
        // if the user has not logged in before (=> getUser returns undefined),
        // we insert the user into the database
        dbUser ??= await insertUser(user.userId);
        // get the users identifiers via the Corbado Node.js SDK
        const userIdentifiers = await getUserIdentifiers(user.userId);
        return c.json({
            user: dbUser,
            identifiers: userIdentifiers.identifiers,
        });
    })
    .post("/city", requireAuth, async (c) => {
        const user = c.get("user");
        assert(
            user,
            "User is not defined. Use authentication middleware to protect this route.",
        );
        const body = await c.req.json();
        const city = body.city;
        if (!city || typeof city !== "string") {
            throw new HTTPException(400, {
                message: "City is required and must be a string",
            });
        }
        await updateUserCity(user.userId, city);
        const updatedUser = getUser(user.userId);
        if (!updatedUser) {
            return c.status(200);
        }
        return c.json(updatedUser);
    });
