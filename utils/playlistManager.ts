import playlistService from "../services/playlistService";
import { Playlist, Voice } from "../types";
import stateService from "../services/stateService";
import { ErrorWithStatus } from "../classes";
import voiceService from "../services/voiceService";

const createPlaylist = async () => {
    const playlist: Playlist = await playlistService.addPlaylist();
    if(!playlist || !playlist.playlist_id) {
        throw new ErrorWithStatus("Playlist creation failed!", 500);
    }
    
    const state = await stateService.getState();
    if(!state) {
        await stateService.addState(100000, Number(playlist.playlist_id));
    } else {
        await stateService.updateList(state.id, Number(playlist.playlist_id));
    }
};

const addVoiceToList = async (voice: Voice['voice_id']) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const state = await stateService.getState();
    
    if(!state) {
        console.log("There is no playlist to put this in!");
    } else {
        await playlistService.addVoiceToPlaylist(voice, String(state.current_list), time);
    }
};

export const handleNewVoice = async(voice: Voice['voice_id']) => {
    const existingPlaylist: Playlist = await playlistService.getPlaylistByDay(new Date());
    if(!existingPlaylist) {
        try {
            await createPlaylist();
        } catch(e){
            console.log(e);
            throw new ErrorWithStatus("Could not create playlist", 500);
        }
        
    }

    try {
        await addVoiceToList(voice);
        await voiceService.updateLastPlay(voice);
    } catch(e) {
        console.log(e);
        throw new ErrorWithStatus("Could not add voice to list", 500);
    }
    
};