import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface AuthState{
    finished: boolean,
    user?: object, // do not cache this!!
    status: string
}

const initialState: AuthState = {
    finished: false,
    user: undefined,
    status: "idle"
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        login: (state) => {
            // todo: login request
            state.finished = true
        },
        logout: (state) => {
            // todo: logout request
            state.finished = false
        },
    }
})

export const selectFinished = (state: RootState) => state.auth.finished

export const { login, logout } = authSlice.actions

export default authSlice.reducer

