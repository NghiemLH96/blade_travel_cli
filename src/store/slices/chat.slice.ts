import { createSlice } from "@reduxjs/toolkit/react";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        data: []
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        }
    }
})

export const chatReducer = chatSlice.reducer;
export const chatAction = chatSlice.actions;