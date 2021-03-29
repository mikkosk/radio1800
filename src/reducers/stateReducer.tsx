import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import stateService from '../services/stateService';
import { NodeState } from '../types';

const initialState: NodeState = {id: -1, chars: 0, current_list: -1, last_updated: new Date().toDateString()};

export const fetchState = createAsyncThunk(
    'state/fetchState',
    async(_req, _thunkAPI) => {
        try {
            const res = await stateService.getState();
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
        builder.addCase(fetchState.fulfilled, (state, action) => {
            const {id, chars, current_list, last_updated} = action.payload;
            return ({...state, chars, id, current_list, last_updated});
        });
    }
});

export default stateSlice.reducer;