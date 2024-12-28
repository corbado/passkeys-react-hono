import { useCorbado } from "@corbado/react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/user.tsx";
import { use } from "react";

export default function OnboardingPage() {
    const { loading, isAuthenticated } = useCorbado();
    const navigate = useNavigate();
    const userCtx = use(UserContext);

    if (!isAuthenticated && !loading) {
        navigate("/login");
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const city = formData.get("city") as string;
        try {
            await userCtx.updateUserCity(city);
        } catch (e) {
            console.error("Failed to update user city:", e);
        }
        navigate("/");
    }

    return (
        <div>
            <h1>Onboarding</h1>
            <h2>Choose your city</h2>
            <form id="city-form" method="post" onSubmit={onSubmit}>
                <input type="text" name="city" required />
                <button type="submit">Finish onboarding</button>
            </form>
        </div>
    );
}
