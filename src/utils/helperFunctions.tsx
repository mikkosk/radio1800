import { Dispatch } from "react";
import { addNotification, removeNotification } from "../reducers/notificationReducer";
import loginStorage from "./loginStorage";

export const showNotification = (message: string, error: boolean, dispatch: Dispatch<unknown>) => {
    console.log("Tulee");
    dispatch(addNotification({message, error}));
    setTimeout(() => dispatch(removeNotification()), 2000);
};

export const test = (text: string, viable: string[]) => {
    const starts = (link:string) => {
        return text.startsWith(link);
    };
    return viable.some(starts);
  };


export const getAuthenticationHeaders = () => {
    const user = loginStorage.loadUser();
    if(!user) {
        return {
            headers: { Authorization: `bearer FalseToken`}
        };
    }
    return {
        headers: { Authorization: `bearer ${user.token}` }
    };
};
  
