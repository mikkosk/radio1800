import {combineReducers} from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from './reducers/userReducer';
import loginReducer from './reducers/loginReducer';
import stateReducer from './reducers/stateReducer';
import notificationReducer from './reducers/notificationReducer';
import playlistReducer from './reducers/playlistReducer';

export const rootReducer = combineReducers({
    users: userReducer,
    login: loginReducer,
    state: stateReducer,
    notification: notificationReducer,
    playlist: playlistReducer
});

const store = configureStore({
    reducer: rootReducer
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();