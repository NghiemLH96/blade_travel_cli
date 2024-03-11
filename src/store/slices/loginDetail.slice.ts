import { apis } from "@/service/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface User {
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

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        removeStore:(state,action)=>{
            state.data=action.payload
        },
        createStore:(state,action)=>{
            state.data=action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchUser.rejected, (state) => {
            state.loading = false;
        })
    }
})

const fetchUser = createAsyncThunk(
    'user/validateToken',
    async () => {
        const res = await apis.userApiModule.checkLogin(
            localStorage.getItem("token") || "null"
        );
        return res.data.data
    }
)


export const userReducer = userSlice.reducer;
export const userAction = {
    ...userSlice.actions,
    fetchUser
};