import { Dispatch } from "react";
import { addNotification, removeNotification } from "../reducers/notificationReducer";
import { YYYYMMDD, YYYYMMDDNumber } from "../types";
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
  
export const handleDateChange = (value: string, currentDate: Date, date: YYYYMMDDNumber, setDate: (date: YYYYMMDDNumber) => void): boolean => {
    const dateValue = Number(value);
    if (dateValue < 1) return false;
    if(date.year === currentDate.getFullYear() && date.month === currentDate.getMonth() + 1 && dateValue > currentDate.getDate()) return false;
    if (date.year !== currentDate.getFullYear() || date.month !== currentDate.getMonth() + 1) {
        const months31 = [1,3,5,7,8,10,12];
        if(months31.includes(date.month)) {
            if(dateValue > 31) return false;
        } else if (date.month === 2) {
            if(leapYear(date.year) && dateValue > 29) return false;
            if(!leapYear(date.year) && dateValue > 28) return false;
        } else {
            if(dateValue > 30) return false;
        }
    }
    setDate({...date, date: dateValue});
    return true;
};

export const handleMonthChange = (value: string, currentDate: Date, date: YYYYMMDDNumber, setDate: (date: YYYYMMDDNumber) => void): boolean => {
    const monthValue = Number(value);
    if (monthValue > 0) {
        if((date.year === currentDate.getFullYear() && monthValue <= currentDate.getMonth() + 1) || (date.year !== currentDate.getFullYear() && monthValue < 13)) { 
            if (monthValue === 2) {
                if(leapYear(date.year) && date.date > 29) {
                    setDate({...date, month: monthValue, date: 29});
                    return true;
                }
                else if(!leapYear(date.year) && date.date > 28) {
                    setDate({...date, month: monthValue, date: 28});
                    return true;
                }
                else {
                    setDate({...date, month: monthValue});
                    return true;
                }
            } else {
                setDate({...date, month: monthValue});
                return true;
            }
        }
    }
    return false;
    
};

export const handleYearChange = (value: string, currentDate: Date, date: YYYYMMDDNumber, setDate: (date: YYYYMMDDNumber) => void): boolean => {
    const yearValue = Number(value);
    if(leapYear(date.year) && !leapYear(yearValue) && date.month === 2 && date.date > 28) {
        setDate({...date, year: yearValue, date: 28});
        return true;
    } else if (yearValue > 2019 && yearValue <= currentDate.getFullYear()) {
        setDate({...date, year: yearValue});
        return true;
    }
    return false;
};