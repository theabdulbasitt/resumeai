import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setApiToken } from "@/services/api";

export const AuthSync = () => {
    const { getToken, isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        const syncToken = async () => {
            if (isLoaded && isSignedIn) {
                try {
                    const token = await getToken();
                    setApiToken(token);
                } catch (error) {
                    console.error("Error fetching Clerk token:", error);
                    setApiToken(null);
                }
            } else if (isLoaded && !isSignedIn) {
                setApiToken(null);
            }
        };

        syncToken();

        // Refresh token periodically or on visibility change if needed
        const interval = setInterval(syncToken, 1000 * 60 * 5); // 5 minutes
        return () => clearInterval(interval);
    }, [getToken, isSignedIn, isLoaded]);

    return null;
};
