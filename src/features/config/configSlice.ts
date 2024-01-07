import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

interface ConfigState {
    darkMode?: boolean // client side
    allowRegister?: boolean // server side
    status: string
    error?: string
}

// cache
const initialState: ConfigState = {
    darkMode: undefined, // undefined => system preference, false => daylight mode, true => dark mode
    allowRegister: true,
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
}

export const configSlice = createSlice({
    name: "config",
    initialState: initialState,
    reducers: {
        toggleDarkMode: (state) => {
            // todo: login request
            if (typeof state.darkMode === "undefined") {
                state.darkMode = true
            } else {
                state.darkMode = !state.darkMode
            }
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload
            console.log(`set darkMode: ${action.payload}`);
        }
    }
})

export const selectDarkMode = (state: RootState) => state.config.darkMode

export const {toggleDarkMode, setDarkMode} = configSlice.actions

export default configSlice.reducer
