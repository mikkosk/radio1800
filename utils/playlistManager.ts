import playlistService from "../services/playlistService";
import { Playlist, Voice } from "../types";
import stateService from "../services/stateService";
export const createPlaylist = async () => {

    const playlist: Playlist = await playlistService.addPlaylist();
    if(!playlist || !playlist.playlist_id) {
        throw new Error("Playlist creation failed!");
    }
    
    const state = await stateService.getState();
    if(!state) {
        await stateService.addState(100000, Number(playlist.playlist_id));
    } else {
        await stateService.updateList(state.id, Number(playlist.playlist_id));
    }
};

export const addVoiceToList = async (voice: Voice['voice_id']) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const state = await stateService.getState();
    if(!state) {
        console.log("There is no playlist to put this!");
    } else {
        await playlistService.addVoiceToPlaylist(voice, String(state.current_list), time);
    }
};
