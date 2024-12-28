import { Link } from "react-router";
import { useCorbado } from "@corbado/react";
import { useQuery } from "@tanstack/react-query";

export default function UserAreaPage() {
    const { isAuthenticated, loading } = useCorbado();

    return isAuthenticated && !loading ? (
        <UserAreaAuthenticated />
    ) : (
        <UserAreaGuest />
    );
}

function UserAreaAuthenticated() {
    const { sessionToken, loading } = useCorbado();
    const {
        data: secret,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["get-secret"],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/secret`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                },
            );
            return (await res.json()).secret as string;
        },
        enabled: false,
    });

    return (
        <div>
            <h1>User area!</h1>
            <p>Since you are logged-in, we can tell you a secret:</p>
            <button
                id="reveal-secret-button"
                onClick={() => refetch()}
                disabled={loading || isLoading || !!secret}
            >
                Reveal secret
            </button>
            <div id="reveal-secret-result">
                <RevealSecretResult
                    secret={secret}
                    loading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
}

function RevealSecretResult({
    secret,
    loading,
    error,
}: {
    secret: string | undefined;
    loading: boolean;
    error: Error | null;
}) {
    if (secret) {
        return (
            <div id="secret-box">
                <h3>Secret: </h3>
                <p>{secret}</p>
            </div>
        );
    }
    if (loading) {
        return <div className="loader" />;
    }
    if (error) {
        return (
            <div>
                <p>Failed to reveal secret: {error?.message}</p>
            </div>
        );
    }
    return null;
}

function UserAreaGuest() {
    return (
        <div>
            <h1>User area!</h1>
            <p>This page is for logged-in users only. Please login:</p>
            <Link className="button" to="/login">
                Login
            </Link>
        </div>
    );
}
