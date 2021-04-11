import { Dispatch } from "react";
import { addNotification, removeNotification } from "../reducers/notificationReducer";
import { YYYYMMDD } from "../types";
import loginStorage from "./loginStorage";

export const showNotification = (message: string, error: boolean, dispatch: Dispatch<unknown>) => {
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

export const dateToYYYYMMDD = (date: Date): YYYYMMDD => {
    const currentDate = date;
    const final = {year: String(currentDate.getFullYear()), month: String(currentDate.getMonth() + 1), date: String(currentDate.getDate())};
    return final;
};

export const parseYYYYMMDD = (fullDate: YYYYMMDD): YYYYMMDD | false => {
    const year = Number(fullDate.year);
    const month = Number(fullDate.month);
    const date = Number(fullDate.date);
    if(!year || year < 1000 || year > 9999) {
        return false;
    }
    if(!month || month < 1 || month > 12) {
        return false;
    }
    if(!date || date < 1 || date > 31) {
        return false;
    }
    return fullDate;
};

export const compareDates = (a: Date, b: Date): boolean => {
    const aY = dateToYYYYMMDD(a);
    const bY = dateToYYYYMMDD(b);
    if(aY.date === bY.date && aY.month === bY.month && aY.year === bY.year) return true;
    return false;
};

export const leapYear = (year: number) => {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};
  
export const handleDateChange = (value: string, currentDate: Date, date: YYYYMMDD, setDate: (date: YYYYMMDD) => void): boolean => {
    const dateValue = Number(value);
    const year = Number(date.year);
    const month = Number(date.month);

    if (dateValue < 1) return false;
    if(year === currentDate.getFullYear() && month === currentDate.getMonth() + 1 && dateValue > currentDate.getDate()) return false;
    if (year !== currentDate.getFullYear() || month !== currentDate.getMonth() + 1) {
        const months31 = [1,3,5,7,8,10,12];
        if(months31.includes(month)) {
            if(dateValue > 31) return false;
        } else if (month === 2) {
            if(leapYear(year) && dateValue > 29) return false;
            if(!leapYear(year) && dateValue > 28) return false;
        } else {
            if(dateValue > 30) return false;
        }
    }
    setDate({...date, date: String(dateValue)});
    return true;
};

export const handleMonthChange = (value: string, currentDate: Date, date: YYYYMMDD, setDate: (date: YYYYMMDD) => void): boolean => {
    const monthValue = Number(value);
    const year = Number(date.year);
    const dateN = Number(date.date);

    if (monthValue > 0) {
        if((year === currentDate.getFullYear() && monthValue <= currentDate.getMonth() + 1) || (year !== currentDate.getFullYear() && monthValue < 13)) { 
            if (monthValue === 2) {
                if(leapYear(year) && dateN > 29) {
                    setDate({...date, month: String(monthValue), date: "29"});
                    return true;
                }
                else if(!leapYear(year) && dateN > 28) {
                    setDate({...date, month: String(monthValue), date: "28"});
                    return true;
                }
                else {
                    setDate({...date, month: String(monthValue)});
                    return true;
                }
            } else {
                setDate({...date, month: String(monthValue)});
                return true;
            }
        }
    }
    return false;
    
};

export const handleYearChange = (value: string, currentDate: Date, date: YYYYMMDD, setDate: (date: YYYYMMDD) => void): boolean => {
    const yearValue = Number(value);
    const year = Number(date.year);
    const month = Number(date.month);
    const dateN = Number(date.date);
    if(leapYear(year) && !leapYear(yearValue) && month === 2 && dateN > 28) {
        setDate({...date, year: String(yearValue), date: "28"});
        return true;
    } else if (yearValue > 2019 && yearValue <= currentDate.getFullYear()) {
        setDate({...date, year: String(yearValue)});
        return true;
    }
    return false;
};