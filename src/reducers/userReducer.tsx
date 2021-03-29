import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

const initialState: UserState = {users: {}};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            const user: User = action.payload;
            return {...state, users: {...state.users, [user.user_id]: {...user}}};
            }
    }
});

export const {setUser} = usersSlice.actions;
export interface UserState {
    users: { [id: number]: User },
}

export default usersSlice.reducer;