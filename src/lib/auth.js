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

export function isTokenValid(token) {
    if (!token) {
        return false;
    }

    try {
        const payload = getTokenUser(token);
        return !payload.exp || payload.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
}

export function getAuth() {
    try {
        const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
        if (auth?.token && !isTokenValid(auth.token)) {
            clearAuth();
            return null;
        }
        return auth;
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

    export function getUserInitial(user = {}) {
        const name = user.firstName || user.firstname || user.name || user.email || "U";
        return name.trim().charAt(0).toUpperCase() || "U";
    }

export function clearAuth() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("token");
    window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

export { AUTH_UPDATED_EVENT };
