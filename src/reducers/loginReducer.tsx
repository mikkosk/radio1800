import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoggedInUser, LoginCredentials } from "../types";
import loginService from '../services/loginService';

const initialState: LoginState = {user: null};

export const login = createAsyncThunk(
    'login/login',
    async(credentials: LoginCredentials, _thunkAPI) => {
        const {user_name, password} = credentials;
        try {
            const response = await loginService.login(user_name, password);
            return response;
        } catch (e) {
            throw new Error(e.response.data);
        }
    }
);

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logout(_state) {
            return initialState;
        },
        loadUser(state, action: PayloadAction<LoggedInUser>) {
            const user = action.payload;
            return {...state, user};
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            const user = action.payload;
            return ({...state, user});
        });
    }
});

export const { logout, loadUser } = loginSlice.actions;

export interface LoginState {
    user: LoggedInUser | null
}

export default loginSlice.reducer;