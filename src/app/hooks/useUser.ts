import { useEffect, useState } from "react";
import { useToken } from "./useToken";

export const useUser = () => {
    const [token, setToken] = useToken();
    const getPayloadFromToken = (token: string) => {
        const encodedPayload = token.split('.')[1];
        // return Buffer.from(encodedPayload, 'base64');
        return JSON.parse(atob(encodedPayload));
    }
    const [user, setUser] = useState(() => {
        if (token === null) { 
            return null
        } else { return getPayloadFromToken(token); }
    });

    useEffect(() => {
        if(!token) {
            setUser(null);
        } else {
            setUser(getPayloadFromToken(token));
        }
    },[token]);

    return user;
};