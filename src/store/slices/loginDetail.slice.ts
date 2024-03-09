import { apis } from "@/service/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
    id: number;
    userName: string;
    password: string;
    avatar:string;
    wallet:number
}

interface UserState {
    id: any;
    avatar: string;
    data: User | null;
    loading: boolean
}

let initialState: UserState = {
    data: null,
    loading: false,
    id: undefined,
    avatar: ""
}

export const loginDetailSlice = createSlice({
    name:"login-detail",
    initialState,
    reducers:{},
    extraReducers(builder) {
        builder.addCase(fetchUser.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchUser.rejected, (state) => {
            state.loading = false;
        })
    },
})

const fetchUser = createAsyncThunk(
    'user/fetchToken',
    async()=>{
            const result = await apis.userApiModule.checkLogin(localStorage.getItem('token') || "null") 
            return result.data.data
    }
)


export const userReducer = loginDetailSlice.reducer;
export const userAction = {
    ...loginDetailSlice.actions,
    fetchUser
};