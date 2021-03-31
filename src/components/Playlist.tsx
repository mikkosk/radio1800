import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPlaylist } from '../reducers/playlistReducer';
import { RootState, useAppDispatch } from '../store';
import { leapYear, parseYYYYMMDD, showNotification } from '../utils/helperFunctions';

const PlaylistComponent: React.FC = () => {
    const playlist = useSelector((state: RootState) => state.playlist);
    const [currentDate] = useState<Date>(new Date());
    
    const initialDate = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        date: currentDate.getDate()
    };
    const [date, setDate] = useState<{year: number, month: number, date: number}>(initialDate);

    const dispatch = useAppDispatch();
    
    const tryFetchPlaylist = async() => {
        const parsedDate = parseYYYYMMDD(date.year, date.month, date.date);
        if(!parsedDate) return;
        try {
            const actionRes = await dispatch(fetchPlaylist(parsedDate));
            unwrapResult(actionRes);
        } catch (e) {
            showNotification(e.message, true, dispatch);
        }
    };
 
    useEffect(() => {
        void tryFetchPlaylist();
    }, []);


    const handleDateChange = (value: string) => {
        const dateValue = Number(value);
        if (dateValue < 1) return;
        if(date.year === currentDate.getFullYear() && date.month === currentDate.getMonth() + 1 && dateValue > currentDate.getDate()) return;
        if (date.year !== currentDate.getFullYear() || date.month !== currentDate.getMonth() + 1) {
            const months31 = [1,3,5,7,8,10,12];
            if(months31.includes(date.month)) {
                if(dateValue > 31) return;
            } else if (date.month === 2) {
                if(leapYear(date.year) && dateValue > 29) return;
                if(!leapYear(date.year) && dateValue > 28) return;
            } else {
                if(dateValue > 30) return;
            }
        }
        setDate({...date, date: dateValue});
    };

    const handleMonthChange = (value: string) => {
        const monthValue = Number(value);
        if (monthValue > 0) {
            if((date.year === currentDate.getFullYear() && monthValue <= currentDate.getMonth() + 1) || (date.year !== currentDate.getFullYear() && monthValue < 13)) { 
                if (monthValue === 2) {
                    if(leapYear(date.year) && date.date > 29) setDate({...date, month: monthValue, date: 29});
                    else if(!leapYear(date.year) && date.date > 28) setDate({...date, month: monthValue, date: 28});
                    else setDate({...date, month: monthValue});
                } else {
                    setDate({...date, month: monthValue});
                }
            }
        }
        
    };

    const handleYearChange = (value: string) => {
        const yearValue = Number(value);
        if(leapYear(date.year) && !leapYear(yearValue) && date.month === 2 && date.date > 28) {
            setDate({...date, year: yearValue, date: 28});
        } else if (yearValue > 2019 && yearValue <= currentDate.getFullYear()) {
            setDate({...date, year: yearValue});
        }
    };

    return(
        <div>
            <h1>Soineet äänitteet</h1>
            <div>
                <h3>
                    Päivältä:
                </h3>
                <input type="number" max="2100" min="2020" value={date.year} onChange={({target}) => handleYearChange(target.value)}></input>
                <input type="number" max="12" min="1" value={date.month} onChange={({target}) => handleMonthChange(target.value)}></input>
                <input type="number" max="31" min="1" value={date.date} onChange={({target}) => handleDateChange(target.value)}></input>
                <button type="button" onClick={() => tryFetchPlaylist()}>Hae</button>
            </div>
            <div>
                {playlist && playlist.voices &&
                    playlist.voices.map(v => {
                        return (
                            <div key={v.voice_id + v.play_time}>
                                <b>{v.play_time}</b>
                                <p>{v.from_text}</p>
                            </div>
                        );
                    })
                }
                {!playlist || !playlist.voices &&
                    <p>Tältä päivältä ei löytynyt äänitteitä</p>
                }
            </div>
        </div>
    );
};

export default PlaylistComponent;