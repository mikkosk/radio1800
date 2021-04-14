import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPlaylist } from '../reducers/playlistReducer';
import metadataService from '../services/metadataService';
import { RootState, useAppDispatch } from '../store';
import BookCard from '../svgs/card';
import PlayButton from '../svgs/PlayButton';
import { IcecastMetadata, Metadata } from '../types';
import { compareDates, dateToYYYYMMDD, showNotification } from '../utils/helperFunctions';
import ChosenVoice from './ChosenVoice';
import PlaylistComponent from './Playlist';

export const AudioPlayer: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [lastCheck, setLastCheck] = useState(-1);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [failed, setFailed] = useState(false);
    const [active, setActive] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [currentDate] = useState(new Date());
    const listDate = useSelector((store: RootState) => store.playlist.play_date);

    const dispatch = useAppDispatch();

    const setNewMetada = async (meta: Metadata) => {
        setMetadata(meta);
        if(compareDates(new Date(listDate), currentDate)) {
            try {
                const actionRes = await dispatch(fetchPlaylist(dateToYYYYMMDD(currentDate)));
                unwrapResult(actionRes);
            } catch (e) {
                showNotification(e.message, true, dispatch);
            }
        }
    };

    const getMetadata = async (current: number, initial: boolean) => {
        if(current % 10 === 0 && current !== lastCheck || initial) {
            try {
                const iceMetadata: IcecastMetadata = await metadataService.getMetadata();
                if(iceMetadata  && iceMetadata.icestats.source.title) {
                    const dirtyMetadata = iceMetadata.icestats.source.title;
                    const cleanMetadata = JSON.parse(dirtyMetadata.split("'").join("\"")) as Metadata;
                    if(!metadata || cleanMetadata.voice_id !== metadata.voice_id) {
                            await setNewMetada(cleanMetadata);
                        }
                } else {
                    setMetadata(null);
                }
            } catch (e) {
                console.log(e);
                showNotification("Ongelma metadatan hakemisessa", true, dispatch);
            }
        }
    };

    const togglePlaying = async () => {
        if(connecting || failed) return;
        if(document.getElementById('player')) {
            const player = document.getElementById('player') as HTMLAudioElement;
            if (!player) return;
            if(!playing) {
                setConnecting(true);
                if(player.paused) {
                    await player.play();
                }
                player.muted = false;
                await getMetadata(0, true);
                setConnecting(false);
            } else {
                player.muted = true;
            }
            setPlaying(!playing);
        }

    };

    const onError = () => {
        setFailed(true);
    };

    const onTimeUpdate = async () => {
        const audio = document.getElementById('player') as HTMLAudioElement;
        const current = Math.floor(audio.currentTime);
        setLastCheck(current);
        await getMetadata(current, false);
    };

    const isLoaded = () => {
        setLoaded(true);
        console.log("Loaded!");
    };

    return(
        <div>       
            <div>
                <audio onTimeUpdate={onTimeUpdate} onLoadedData={() => isLoaded()} id='player'>
                    <source src={"http://"+ location.hostname+"/stream/basic-radio"} onError={onError} />
                </audio>
            </div>
            
            <div>
            <div className= {active ? "book animate" : "book"}>
                <div className={active ? "cover animate" : "cover"}></div>
                <div className={active ? "page animate" : "page"}>
                    {active &&
                        <div className="rotate-back fit-inside">
                            <PlaylistComponent /> 
                        </div>
                    }
                </div>
                <div className={active ? "page turn animate" : "page turn"}>
                    {active &&
                        <div className="play-page-grid">
                            <div className="full-height">
                                <PlayButton playing={playing} setPlaying={togglePlaying}/> 
                            </div>
                            <div className="now-plays-grid">
                                {playing && <h1>~ Nyt soi ~</h1>}
                                <ChosenVoice metadata={metadata} active={playing} errorString={"Laita radio päälle!"}/>
                            </div> 
                        </div>
                    }
                </div>
                <div className={active ? "cover turn animate" : "cover turn"}>
                    <div className="rotate-back">
                        <BookCard failed={failed} loaded={loaded} open={setActive} togglePlaying={togglePlaying}/>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};
