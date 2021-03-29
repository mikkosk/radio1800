import { LoggedInUser } from "../types";

const loggedKey = "LoggedUser";

const saveUser = (user: LoggedInUser) => {
    localStorage.setItem(loggedKey, JSON.stringify(user));
};

const loadUser = (): LoggedInUser | null => {
    const user = localStorage.getItem(loggedKey);
    if(!user) {
        return null;
    }
    return JSON.parse(user) as LoggedInUser;
};

const logoutUser = () => {
    localStorage.removeItem(loggedKey);
};

export default {
    saveUser,
    loadUser,
    logoutUser
};