import { Dispatch } from "react";
import { addNotification, removeNotification } from "../reducers/notificationReducer";
import { YYYYMMDD } from "../types";
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

export const parseYYYYMMDD = (year: number, month: number, date: number): YYYYMMDD | false => {
    if(!year || year < 1000 || year > 9999) {
        return false;
    }
    if(!month || month < 1 || month > 12) {
        return false;
    }
    if(!date || date < 1 || date > 31) {
        return false;
    }
    return {
        year: String(year),
        month: String(month),
        date: String(date)
    };
};

export const leapYear = (year: number) => {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};
  
