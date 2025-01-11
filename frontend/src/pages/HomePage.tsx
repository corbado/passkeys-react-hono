import { useCorbado } from "@corbado/react";
import { use } from "react";
import { UserContext } from "../context/user.tsx";
import { Link } from "react-router";

export default function HomePage() {
    const { isAuthenticated, user, loading } = useCorbado();
    const userCtx = use(UserContext);

    if (loading) {
        return <div className="loader" />;
    }

    if (!isAuthenticated || !user) {
        return <GuestHomePage />;
    }

    const city =
        (userCtx.externalUserInfo.status === "success" &&
            userCtx.externalUserInfo.user.city) ||
        "unknown";

    return (
        <div>
            <h1>
                Welcome {user.name} from {city}!
            </h1>
            <p>
                You now have access to everything and can visit the user area:
            </p>
            <Link to="/userarea" className="button">
                User area
            </Link>
        </div>
    );
}

function GuestHomePage() {
    return (
        <div>
            <h1>Welcome Guest!</h1>
            <p>
                This example demonstrates Corbado's passkey-first authentication
                solution.
            </p>
            <p>It covers all relevant aspects like -</p>
            <ul>
                <li>Sign-up</li>
                <li>Login</li>
                <li>Protecting Routes</li>
            </ul>
            <p>
                It can be used as a starting point for your own application or
                to learn.
            </p>
            <Link className="button" to="/signup">
                Sign up
            </Link>
            <Link className="button" to="/login">
                Login
            </Link>
        </div>
    );
}
