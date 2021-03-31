import React, { useState } from 'react';
import metadataService from '../services/metadataService';
import { IcecastMetadata, Metadata } from '../types';
import PlaylistComponent from './Playlist';

export const AudioPlayer: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [lastCheck, setLastCheck] = useState(-1);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [failed, setFailed] = useState(false);

    const getMetadata = async (current: number, initial: boolean) => {
        if(current % 10 === 0 && current !== lastCheck || initial) {
            const iceMetadata: IcecastMetadata = await metadataService.getMetadata();
            if(iceMetadata  && iceMetadata.icestats.source.title) {
                const dirtyMetadata = iceMetadata.icestats.source.title;
                const cleanMetadata = JSON.parse(dirtyMetadata.split("'").join("\"")) as Metadata;
                if(!metadata || cleanMetadata.voice_id !== metadata.voice_id) {
                    console.log(cleanMetadata);
                    console.log((metadata));
                    setMetadata(cleanMetadata);
                }
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
        setFailed(true);
    };

    const onTimeUpdate = () => {
        const audio = document.getElementById('player') as HTMLAudioElement;
        const current = Math.floor(audio.currentTime);
        setLastCheck(current);
        void getMetadata(current, false);
    };

    return(
        <div>
            {failed && <div>
                <h4>Ei saatu yhteyttä striimiin. Päivitä sivu kokeillaksesi uudestaan!</h4>
            </div>
            }
            
            <div>
                <audio onTimeUpdate={onTimeUpdate} id='player'>
                    <source src="http://localhost:8000/basic-radio" onError={onError} />
                </audio>
                <div> 
                    <button disabled={connecting || failed} onClick={() => togglePlaying()}>{failed ? "Ei voitu yhdistää ": connecting ? "Yhdistetään..." : playing ? "Hiljennä!" : "Kuuntele!"}</button> 
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
            <PlaylistComponent />  
        </div>
    );
};
