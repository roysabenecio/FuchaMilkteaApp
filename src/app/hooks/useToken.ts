import { useState } from "react";

export const useToken = () => {
    const [token, setInternalToken] = useState(() => {
        return localStorage.getItem("token")
    });

    const setToken = (newToken: string) => {
        localStorage.setItem("token", JSON.stringify(newToken));
        setInternalToken(newToken);
    }

    return [token, setToken] as const;
}