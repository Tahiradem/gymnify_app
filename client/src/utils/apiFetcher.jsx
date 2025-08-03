// utils/apiFetcher.js
import { getAuthData } from "./authStorage";

export const fetchUserData = async () => {
    const { email, password } = getAuthData();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return await response.json();
};