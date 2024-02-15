import { configureStore } from "@reduxjs/toolkit";
import { loginDetailSlice } from "./slices/loginDetail.slice";
import { TypedUseSelectorHook, useDispatch , useSelector} from "react-redux";

export const store = configureStore({
    reducer:{
        user:loginDetailSlice.reducer
    }
})

export const useAppDispatch:() => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;