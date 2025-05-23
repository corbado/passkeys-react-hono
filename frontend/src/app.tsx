import { CorbadoProvider } from "@corbado/react";
import englishTranslations from "./utils/corbado-translations.ts";
import UserProvider from "./context/user.tsx";
import Layout from "./layouts/layout.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage.tsx";
import UserAreaPage from "./pages/UserAreaPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import OnboardingPage from "./pages/OnboardingPage.tsx";
import { useRef } from "react";
import { sendEvent } from "@corbado/shared-util";
import { useEffect } from "react";
import { TelemetryEventType } from "@corbado/shared-util";

const queryClient = new QueryClient();

export default function App() {
    const hasSentTelemetry = useRef(false);

    useEffect(() => {
        if (hasSentTelemetry.current) return;

        void sendEvent({
            type: TelemetryEventType.EXAMPLE_APPLICATION_OPENED,
            payload: {
                exampleName: "corbado/ts-react-ts-hono",
            },
            sdkVersion: "3.1.0",
            sdkName: "React SDK",
            identifier: import.meta.env.VITE_CORBADO_PROJECT_ID,
        });
    }, []);

    return (
        <CorbadoProvider
            projectId={import.meta.env.VITE_CORBADO_PROJECT_ID}
            // enable dark mode for the Corbado UI
            darkMode="on"
            // apply our custom styles to the Corbado UI
            theme="cbo-custom-styles"
            // use our custom translations
            customTranslations={{ en: englishTranslations }}
        >
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <RoutesDefinition />
                </UserProvider>
            </QueryClientProvider>
        </CorbadoProvider>
    );
}

function RoutesDefinition() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/userarea" element={<UserAreaPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                        path="/signup/onboarding"
                        element={<OnboardingPage />}
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
