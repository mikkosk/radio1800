import React, { useState } from 'react';
import metadataService from '../services/metadataService';
import { useAppDispatch } from '../store';
import { IcecastMetadata, Metadata } from '../types';
import { showNotification } from '../utils/helperFunctions';

export const AudioPlayer: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [lastCheck, setLastCheck] = useState(-1);
    const [metadata, setMetadata] = useState<Metadata | null>(null);

    const dispatch = useAppDispatch();

    const getMetadata = async (current: number, initial: boolean) => {
        if(current % 10 === 0 && current !== lastCheck || initial) {
            const iceMetadata: IcecastMetadata = await metadataService.getMetadata();
            if(iceMetadata  && iceMetadata.icestats.source.title) {
                const dirtyMetadata = iceMetadata.icestats.source.title;
                const cleanMetadata = JSON.parse(dirtyMetadata.split("'").join("\"")) as Metadata;
                setMetadata(cleanMetadata);
            } else {
                setMetadata(null);
            }
        }
    };

    const togglePlaying = async () => {
        if(document.getElementById('player')) {
            if(!playing) {
                setConnecting(true);
                await (document.getElementById('player') as HTMLAudioElement).play();
                void getMetadata(0, true);
                setConnecting(false);
            } else {
                (document.getElementById('player') as HTMLAudioElement).pause();
            }
            setPlaying(!playing);
        }

    };

    const onError = () => {
        setConnecting(true);
        showNotification("Striimiä ei voitu ladata. Kokeile päivittää sivu!", true, dispatch);
    };

    const onTimeUpdate = () => {
        const audio = document.getElementById('player') as HTMLAudioElement;
        const current = Math.floor(audio.currentTime);
        setLastCheck(current);
        void getMetadata(current, false);
    };

    return(
        <div>
            <div>
                <audio onTimeUpdate={onTimeUpdate} id='player'>
                    <source src="http://localhost:8000/basic-radio" onError={onError} />
                </audio>
                <div> 
                    <button disabled={connecting} onClick={() => togglePlaying()}>{connecting ? "Yhdistetään..." : playing ? "Hiljennä!" : "Kuuntele!"}</button> 
                </div>
            </div>
            <div>
                {playing && metadata &&
                <div>
                    <h1>Nyt soi:</h1>
                    <p>{metadata.from_text}</p>
                    <h3>Vuodelta:</h3>
                    <p>{metadata.year}</p>
                    <h3>Arvioitu pituus:</h3>
                    <p>{metadata.voice_length}</p>
                    <h3>Linkki tekstiin:</h3>
                    <p>{metadata.to_text}</p>
                </div>
                }
            </div>    
        </div>
    );
};
