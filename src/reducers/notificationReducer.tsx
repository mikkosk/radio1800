import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: NotificationState = {notifications: []};

const loginSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        removeNotification(state) {
            return {...state, notifications: state.notifications.slice(1)};
        },
        addNotification(state, action: PayloadAction<Notification>) {
            const notification = action.payload;
            return {...state, notifications: state.notifications.concat(notification)};
        }
    }
});

export const { removeNotification, addNotification } = loginSlice.actions;

export interface Notification {
    message: string,
    error: boolean
}
export interface NotificationState {
    notifications: Notification[]
}

export default loginSlice.reducer;
