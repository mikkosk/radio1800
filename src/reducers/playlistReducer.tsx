import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import playlistService from '../services/playlistService';
import { Playlist, YYYYMMDD } from '../types';

const initialState: Playlist = {playlist_id: "", voices: [], play_date: new Date().toDateString()};

export const fetchPlaylist = createAsyncThunk(
    'state/fetchPlaylist',
    async(date: YYYYMMDD, _thunkAPI) => {
        try {
            const res = await playlistService.getPlaylist(date);
            return res;
        } catch (e) {
            throw new Error(e.response.data);
        }
    }
);

const stateSlice = createSlice({
    name: 'state',
    initialState,
    reducers: {
        /*
        setState(state, action: PayloadAction<NodeState>) {
            const nodeState: NodeState = action.payload;
            return {...state, nodeState};
            }
        */
    },
    extraReducers: builder => {
        builder.addCase(fetchPlaylist.fulfilled, (state, action) => {
            const {playlist_id, voices, play_date} = action.payload;
            return ({...state, playlist_id, voices, play_date});
        });
    }
});

export default stateSlice.reducer;