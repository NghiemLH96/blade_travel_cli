import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const adminLoginDetailSlice = createSlice({
    name:"adminLoginDetail",
    initialState:{
        data:{}
    },
    reducers:{
        createLogin:(state , actions:PayloadAction<Object>)=>{
            state.data = actions.payload
        },
        removeLogin:(state)=>{
            state.data = {}
        }
    }
})

export default adminLoginDetailSlice.reducer;
export const adminAction = adminLoginDetailSlice.actions;