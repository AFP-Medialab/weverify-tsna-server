import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
    connectionEnable: false,
    windowsOpen: false
}

const connectionSlice = createSlice ({
    name: "connexion",
    initialState: defaultState,
    reducers: {

        connectionWindowsOpened (state, action) {
            state.windowsOpen = action.payload;
        },

        connectionEnabled (state, action) {
            state.connectionEnable = action.payload;
        }

    }
}) 

export const {connectionWindowsOpened, 
    connectionEnabled} = connectionSlice.actions;

export default connectionSlice.reducer;