import React, { useEffect, useState } from 'react';
import { Metadata } from '../types';

const ChosenVoice: React.FC<{metadata: Metadata | null, active: boolean, errorString: string}> = ({metadata, active, errorString}) => {
    const [change, setChange] = useState(false);
    const [showing, setShowing] = useState<Metadata | null>(null);
    const [wasActive, setWasActive] = useState(false);
    useEffect(() => {
        if(metadata) {
            if(!wasActive) {
                setShowing(metadata);
                setWasActive(true);
                return;
            } 
            setChange(true);
            setTimeout(() => {
                setShowing(metadata);
                setChange(false);
            }, 1000);
        }
    }, [metadata]);

    return(
        <div className="chosen-voice hide-overflow">
            {active && showing &&
            <div className="chosen-data">
                <div className="chosen-title">
                    <p className={change ? "text-in" : "text-out"}>
                        {showing.from_text && showing.from_text?.length < 20 ? showing.from_text : showing.from_text?.slice(0,17) + "..."}
                    </p>
                </div>
                <div className="chosen-year">
                    <h3>Vuodelta:</h3>
                    <p className={change ? "text-in" : "text-out"}>{showing.year}</p>
                </div>
                <div className="chosen-length">
                    <h3>Arvioitu pituus:</h3>
                    <p className={change ? "text-in" : "text-out"}>{showing.voice_length}</p>
                </div>
                <div className="chosen-link">
                    <h3>Linkki tekstiin:</h3>
                    <a href={showing.to_text} title={showing.to_text} className={change ? "text-in" : "text-out"}>
                        {showing.to_text && showing.to_text?.length < 20 ? showing.to_text : showing.to_text?.slice(0,17) + "..."}
                    </a>
                </div>
            </div>
            }
            {(!active || !metadata) &&
                <h3 className="chosen-error">{errorString}</h3>
            }
        </div>
    );
};

export default ChosenVoice;