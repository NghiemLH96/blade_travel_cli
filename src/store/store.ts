import { userAction, userReducer } from "./slices/loginDetail.slice";
import { adminReducer } from "./slices/adminLoginDetail.slice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const RootReducer = combineReducers({
    userStore: userReducer,
    adminStore: adminReducer
})
export type StoreType = ReturnType<typeof RootReducer>;
export const store = configureStore({
    reducer: RootReducer
})

store.dispatch(userAction.fetchUser())