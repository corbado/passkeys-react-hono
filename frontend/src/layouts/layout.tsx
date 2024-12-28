import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useCorbado } from "@corbado/react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main>
                <section>{children}</section>
                <Footer />
            </main>
        </>
    );
}

function Navbar() {
    const { isAuthenticated, loading, logout } = useCorbado();
    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    async function onLogout() {
        if (!isAuthenticated || loading) return;
        void logout();
        navigate("/");
    }

    return (
        <div>
            <nav>
                <Link to="/">
                    <img
                        src="/logo.svg"
                        alt="Corbado logo"
                        width="40"
                        height="40"
                    />
                    <p>Corbado Example</p>
                </Link>
                <ul>
                    <li>
                        <Link to="/" data-selected={pathname === "/"}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/userarea"
                            data-selected={pathname === "/userarea"}
                        >
                            User area
                        </Link>
                    </li>
                    {isAuthenticated ? (
                        <li>
                            <Link
                                to="/profile"
                                data-selected={pathname === "/profile"}
                            >
                                Profile
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/signup"
                                    data-selected={pathname === "/signup"}
                                >
                                    Sign up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    data-selected={pathname === "/login"}
                                >
                                    Login
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                {isAuthenticated && (
                    <button disabled={loading} onClick={onLogout}>
                        Logout
                    </button>
                )}
            </nav>
        </div>
    );
}

function Footer() {
    return (
        <footer>
            <Link
                to="https://github.com/corbado/example-ts-nextjs.git"
                target="_blank"
            >
                <img
                    src="/github-icon.svg"
                    alt="GitHub icon"
                    width="24"
                    height="24"
                />
                Github
            </Link>
            <Link
                to="https://docs.corbado.com/corbado-complete/fullstack-integration/next-js"
                target="_blank"
            >
                <img
                    src="/documents-icon.svg"
                    alt="Documentation icon"
                    width="24"
                    height="24"
                />
                Documentation
            </Link>
        </footer>
    );
}
