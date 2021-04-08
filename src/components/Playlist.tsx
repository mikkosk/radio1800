import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPlaylist } from '../reducers/playlistReducer';
import { RootState, useAppDispatch } from '../store';
import NumberInput from '../svgs/NumberInput';
import { Metadata, YYYYMMDDNumber } from '../types';
import { handleDateChange, handleMonthChange, handleYearChange, parseYYYYMMDD, showNotification } from '../utils/helperFunctions';
import ChosenVoice from './ChosenVoice';

const PlaylistComponent: React.FC = () => {
    const playlist = useSelector((state: RootState) => state.playlist);
    const [currentDate] = useState<Date>(new Date());

    /*
    const getStrokeLength = () => {
        const p = document.getElementById("stroke") as any
        const length = p ? p.getTotalLength() : ""
        console.log(length);
    }
    */

    const initialDate = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        date: currentDate.getDate()
    };
    const [date, setDate] = useState<YYYYMMDDNumber>(initialDate);
    const [chosen, setChosen] = useState<Metadata & {play_time: string} | null>(null);

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


    const dateChange = (value: string): boolean => {
        return handleDateChange(value, currentDate, date, setDate);
    };

    const monthChange = (value: string): boolean => {
        return handleMonthChange(value, currentDate, date, setDate);
    };

    const yearChange = (value: string): boolean => {
        return handleYearChange(value, currentDate, date, setDate);
    };

    return(
        <div className="playlist-grid">
            <div className="playlist-title">
                <span className="spread">
                    Soineet äänitteet
                </span>
            </div>
            <div className="playlist-explanation">
                <span className="exp-content">
                    Päivältä:
                </span>
            </div>
            <div className="playlist-date date-picker-grid">
                <NumberInput date={date.date} changeDate={dateChange}/>
                <NumberInput date={date.month} changeDate={monthChange}/>
                <NumberInput date={date.year} changeDate={yearChange}/>
            </div>
            <div className="playlist-confirm">
                <button type="button" onClick={() => tryFetchPlaylist()}>Hae</button>
            </div>
            <div className="playlist-list">
                {playlist && playlist.voices &&
                    playlist.voices.map(v => {
                        return (
                            <div className="list-item" key={v.voice_id + v.play_time} onClick={() => setChosen(v)}>
                                <svg className="stroke-svg" width="100%" height="100%" viewBox="0 0 372 182" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                                    <path className={chosen && chosen.play_time == v.play_time ? "active-item-stroke" : "item-stroke"} d="M147.059 2.95013C116.884 5.39675 90.2919 7.06208 63.058 20.6791C53.2964 25.5598 43.3452 31.9012 34.565 38.408C15.19 52.7663 2.69519 73.0763 2.69519 97.2934C2.69519 139.667 52.3776 157.271 86.6965 167.365C116.919 176.254 150.705 176.471 181.884 178.34C223.237 180.819 261.146 178.982 300.499 165.36C320.003 158.608 342.394 153.593 360.862 144.359C367.789 140.896 369.304 137.008 369.304 129.902C369.304 100.875 343.276 84.9242 320.233 71.5442C308.964 65.001 298.783 56.9788 287.519 50.4383C270.427 40.5142 253.19 35.8227 233.91 31.6541C188.801 21.9009 142.435 29.638 97.6716 20.0459" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/> 
                                </svg>
                                <p className="list-time">{v.play_time}</p>
                                <p className="list-title">{v.from_text?.slice(0,9)}</p>
                            </div>
                        );
                    })
                }
                {!playlist || !playlist.voices &&
                    <p className="list-title">Tältä päivältä ei löytynyt äänitteitä</p>
                }
            </div>
            <div className="playlist-current">
                <h1>Valittu kappale:</h1>
                <ChosenVoice metadata={chosen} active={true} errorString={"Valitse tarkasteltava äänite!"}/>
            </div>
        </div>
    );
};

export default PlaylistComponent;