import React, { useState } from 'react';
import metadataService from '../services/metadataService';
import BookCard from '../svgs/card';
import PlayButton from '../svgs/PlayButton';
import { IcecastMetadata, Metadata } from '../types';
import ChosenVoice from './ChosenVoice';
import PlaylistComponent from './Playlist';

export const AudioPlayer: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [lastCheck, setLastCheck] = useState(-1);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [failed, setFailed] = useState(false);
    const [active, setActive] = useState(false);

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
        if(connecting || failed) return;
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
            <div>
                <audio onTimeUpdate={onTimeUpdate} id='player'>
                    <source src="http://localhost:8000/basic-radio" onError={onError} />
                </audio>
            </div>
            
            <div>
            <div className= {active ? "book animate" : "book"}>
                <div className={active ? "cover animate" : "cover"}></div>
                <div className={active ? "page animate" : "page"}>
                    <div className="rotate-back fit-inside">
                        <PlaylistComponent /> 
                    </div>
                </div>
                <div className={active ? "page turn animate" : "page turn"}>
                    <PlayButton playing={playing} setPlaying={togglePlaying}/> 
                    <div className="play-page-grid">
                        {playing && <h1>~ Nyt soi ~</h1>}
                        <ChosenVoice metadata={metadata} active={playing} errorString={"Laita radio päälle!"}/>
                    </div> 
                </div>
                <div className={active ? "cover turn animate" : "cover turn"}>
                    <div className="rotate-back" onClick={() => setActive(true)}>
                        <BookCard connected={true} open={setActive}/>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};
