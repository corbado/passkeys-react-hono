import { UserContext } from "../context/user.tsx";
import { use } from "react";
import { useNavigate } from "react-router";
import { PasskeyList, useCorbado } from "@corbado/react";

export default function ProfilePage() {
    const userCtx = use(UserContext);
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useCorbado();

    if (!isAuthenticated && !loading) {
        navigate("/login");
    }

    const userInfo =
        userCtx.externalUserInfo.status === "success"
            ? userCtx.externalUserInfo
            : null;



    return (
        <div>
            <h1>Profile</h1>
            <p>
                <strong>Example userID: </strong>
                {userInfo?.user.id}
            </p>
            <p>
                <strong>Corbado userID: </strong>
                {userInfo?.user.corbado_user_id}
            </p>
            <h2>Your Identifiers</h2>
            {userInfo && (
                <div id="identifier-list">
                    {userInfo.identifiers.map((identifier) => (
                        <div key={identifier.identifierID}>
                            <p>
                                <strong>Type: </strong>
                                {identifier.type}
                            </p>
                            <p>
                                <strong>Value: </strong>
                                {identifier.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            <h2>Manage your Passkeys</h2>
            <PasskeyList />
        </div>
    );
}
