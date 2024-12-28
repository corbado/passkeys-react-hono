import { createMiddleware } from "hono/factory";
import {
    getAuthenticatedUserFromAuthorizationHeader,
    getAuthenticatedUserFromCookie,
} from "../utils/authentication.js";
import { HTTPException } from 'hono/http-exception';

type User = { userId: string; fullName: string };
type Env = { Variables: { user: User | null } };

export const authenticationMiddleware = createMiddleware<Env>(
    async (c, next) => {
        let user = await getAuthenticatedUserFromCookie(c);
        user ??= await getAuthenticatedUserFromAuthorizationHeader(c);
        c.set("user", user);
        await next();
    },
);

export const requireAuth = createMiddleware<Env>(
    async (c, next) => {
        if (!c.get("user")) {
            throw new HTTPException(401, { message: "Authentication required" });
        }
        await next();
    }
);