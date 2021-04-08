import React from 'react';
import { Metadata } from '../types';

const ChosenVoice: React.FC<{metadata: Metadata | null, active: boolean, errorString: string}> = ({metadata, active, errorString}) => {
    return(
        <div className="chosen-voice">
            {active && metadata &&
            <div>
                <p>{metadata.from_text}</p>
                <h3>Vuodelta:</h3>
                <p>{metadata.year}</p>
                <h3>Arvioitu pituus:</h3>
                <p>{metadata.voice_length}</p>
                <h3>Linkki tekstiin:</h3>
                <a href={metadata.to_text}>{metadata.to_text}</a>
            </div>
            }
            {(!active || !metadata) &&
                <h3>{errorString}</h3>
            }
        </div>
    );
};

export default ChosenVoice;