import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const loginDetailSlice = createSlice({
    name:"login-detail",
    initialState:{
        data:{}
    },
    reducers:{
        createLogin:(state , actions:PayloadAction<Object>)=>{
            state.data = actions.payload
        },
        removeLogin:(state , actions:PayloadAction)=>{
            state.data = {}
        }
    }
})

export default loginDetailSlice.reducer;
export const userAction = loginDetailSlice.actions;