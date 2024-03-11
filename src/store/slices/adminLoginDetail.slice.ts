import { apis } from "@/service/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Admin {
    id: number;
    username: string;
}

interface UserState {
    id: any;
    data: Admin | null;
    loading: boolean
}

let initialState: UserState = {
    data: null,
    loading: false,
    id: undefined,
}

const adminLoginDetailSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        removeStore:(state,action)=>{
            state.data=action.payload
        },
        createStore:(state,action)=>{
            console.log(action.payload);
            
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
    'admin/validateToken',
    async () => {
        const res = await apis.adminApiModule.checkLogin(
            localStorage.getItem("adtkn") || "null"
        );
        return res.data.data
    }
)

export const adminReducer = adminLoginDetailSlice.reducer;
export const adminAction = {
    ...adminLoginDetailSlice.actions,
    fetchUser
};