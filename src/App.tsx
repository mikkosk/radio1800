import React, { useState } from 'react'

const App: React.FC = () => {
    const [playing, setPlaying] = useState(false);

    const togglePlaying = () => {
        if(document.getElementById('player')) {
            if(playing) {
                (document.getElementById('player') as HTMLAudioElement).play()
            } else {
                (document.getElementById('player') as HTMLAudioElement).pause()
            }
            setPlaying(!playing)
        }
    }

    return(
        <div>
            <div>hello webpack</div>
            <div>
                <audio src="http://localhost:8000/basic-radio" id='player'></audio>
                <div> 
                    <button onClick={() => togglePlaying()}>{playing ? "Pause" : "Play"}</button> 
                </div>
            </div>    
        </div>
    )
}

export default App