import { CorbadoAuth } from "@corbado/react";
import { use, useEffect } from "react";
import { UserContext } from "../context/user.tsx";
import { useNavigate } from "react-router";

export default function LoginPage() {
    const userCtx = use(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const externalUserInfo = userCtx.externalUserInfo;
        switch (externalUserInfo.status) {
            case "success":
                if (externalUserInfo.user.city === null) {
                    navigate("/signup/onboarding");
                } else {
                    navigate("/profile");
                }
                return;
            case "error":
                // handle this case more gracefully in a real application
                console.error(externalUserInfo.message);
                return;
        }
    }, [navigate, userCtx.externalUserInfo]);

    return (
        <div>
            <h1>Login</h1>
            <CorbadoAuth
                onLoggedIn={() => {
                    // do nothing here. We have to wait for a backend response
                    // to check whether the user has gone through onboarding already.
                    // The backend call is made in the user store.
                }}
                initialBlock="login-init"
            />
        </div>
    );
}
