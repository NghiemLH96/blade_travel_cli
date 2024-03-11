import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userAction, userReducer } from './slices/loginDetail.slice';
import { adminAction, adminReducer } from "./slices/adminLoginDetail.slice";
import { chatReducer } from "./slices/chat.slice";



const RootReducer = combineReducers({
    userStore: userReducer,
    adminStore: adminReducer,
    chatStore:chatReducer
})

export type StoreType = ReturnType<typeof RootReducer>;


export const store = configureStore({
    reducer: RootReducer
})

store.dispatch(userAction.fetchUser())
store.dispatch(adminAction.fetchUser())