import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice ({
    name: "error",
    initialState: null,
    reducers: {
        errorSet (state, action) {
            state = action.payload;
        },
        errorCleaned (state, action) {
            state = null;
        }
    }
})

export const { errorSet, errorCleaned } = errorSlice.actions;

export default errorSlice.reducer;