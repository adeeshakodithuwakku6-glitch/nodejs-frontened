const AUTH_STORAGE_KEY = "technest-auth";
const AUTH_UPDATED_EVENT = "technest-auth-updated";

function getTokenUser(token) {
    if (!token) {
        return {};
    }

    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch (error) {
        return {};
    }
}

export function getAuth() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    } catch (error) {
        console.error("Could not read auth state:", error);
        return null;
    }
}

export function saveAuth(auth) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
    return auth;
}

export function getUserFromAuthResponse(data, email = "") {
    const responseUser = data?.user || data?.profile || data?.account || data?.data?.user || {};
    const tokenUser = getTokenUser(data?.token);

    return {
        ...tokenUser,
        ...responseUser,
        firstName: responseUser.firstName || responseUser.firstname || data?.firstName || data?.firstname || tokenUser.firstName || tokenUser.firstname || "",
        lastName: responseUser.lastName || responseUser.lastname || data?.lastName || data?.lastname || tokenUser.lastName || tokenUser.lastname || "",
        email: responseUser.email || data?.email || tokenUser.email || email,
    };
}

export function clearAuth() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("token");
    window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

export { AUTH_UPDATED_EVENT };
