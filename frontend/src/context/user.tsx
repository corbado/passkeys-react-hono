import { createContext, ReactNode, useMemo } from "react";
import { useCorbado } from "@corbado/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UserIdentifiers = Array<{
    identifierID: string;
    userID: string;
    status: "pending" | "primary" | "verified";
    type: "email" | "phone" | "username";
    value: string;
}>;
type DBUser = {
    id: string;
    corbado_user_id: string;
    city: string | null;
};
export type ExternalUserInfo =
    | {
          status: "not-loaded";
      }
    | {
          status: "loading";
      }
    | {
          status: "error";
          message: string;
      }
    | {
          status: "success";
          user: DBUser; // the user object from the database
          identifiers: UserIdentifiers;
      };
type GlobalContextType = {
    externalUserInfo: ExternalUserInfo;
    updateUserCity: (city: string) => Promise<void>;
};
type ExternalUserQueryResponse = {
    user: DBUser;
    identifiers: UserIdentifiers;
};

export const UserContext = createContext<GlobalContextType>({
    externalUserInfo: { status: "not-loaded" },
    updateUserCity: async () => {},
});

async function getExternalUserInfo(): Promise<ExternalUserQueryResponse> {
    const rsp = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user`,
        {
            credentials: "include",
        },
    );
    return rsp.json();
}

async function updateUserCity(newCity: string): Promise<DBUser> {
    const rsp = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/city`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ city: newCity }),
        },
    );

    if (!rsp.ok) {
        throw new Error(
            `Failed to submit city: ${rsp.status} ${rsp.statusText}`,
        );
    }

    return rsp.json();
}

export default function UserProvider({ children }: { children: ReactNode }) {
    const { loading, isAuthenticated, user } = useCorbado();
    const queryClient = useQueryClient();

    const {
        data: externalUserData,
        isPending: externalUserDataIsPending,
        error: externalUserDataError,
    } = useQuery({
        queryKey: ["get-external-user-info", user],
        queryFn: getExternalUserInfo,
        enabled: isAuthenticated && !loading,
    });

    const updateUserCityMutation = useMutation({
        mutationFn: updateUserCity,
        onSuccess: (updatedUser) => {
            // Update the cached user data with the new city
            queryClient.setQueryData(
                ["get-external-user-info", user],
                (oldData: ExternalUserQueryResponse | undefined) => {
                    if (oldData?.user.id === updatedUser.id) {
                        return {
                            ...oldData,
                            user: updatedUser,
                        };
                    }
                    return oldData;
                },
            );
        },
        onError: (error: unknown) => {
            console.error("Error updating city:", error);
        },
    });

    const value = useMemo<GlobalContextType>(() => {
        let externalUserInfo: ExternalUserInfo;
        if (!isAuthenticated) {
            externalUserInfo = { status: "not-loaded" };
        } else if (externalUserDataIsPending) {
            externalUserInfo = { status: "loading" };
        } else if (externalUserDataError) {
            externalUserInfo = {
                status: "error",
                message: externalUserDataError.message,
            };
        } else {
            externalUserInfo = {
                status: "success",
                user: externalUserData.user,
                identifiers: externalUserData.identifiers,
            };
        }

        return {
            externalUserInfo,
            updateUserCity: async (newCity: string) => {
                await updateUserCityMutation.mutateAsync(newCity);
            },
        };
    }, [
        externalUserData?.identifiers,
        externalUserData?.user,
        externalUserDataError,
        externalUserDataIsPending,
        isAuthenticated,
        updateUserCityMutation,
    ]);

    return <UserContext value={value}>{children}</UserContext>;
}
