import {createSlice} from "@reduxjs/toolkit";
import {UserCredential} from "../auth/authSlice";
import {createAppAsyncThunk, request} from "../../app/api";
import {RootState} from "../../app/store";

interface RegisterState {
    error?: string;
    status: string; //'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: RegisterState = {
    status: "idle",
};

export const userRegister = createAppAsyncThunk<void, UserCredential>(
    "register/register",
    async (credential: UserCredential, {rejectWithValue}) => {
        try {
            await request.post("/user/register", credential);
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState: initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            console.log("registerSlice => resetStatus");
        },
    },
    extraReducers(builder) {
        builder
            .addCase(userRegister.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.status = "succeeded";
                console.log("registerSlice(fulfilled):", action);
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                console.log("registerSlice(rejected):", action);
            });
    },
});

export const selectError = (state: RootState) => state.register.error;
export const selectStatus = (state: RootState) => state.register.status;

export const {resetStatus} = registerSlice.actions;
// do not cache this reducer
export default registerSlice.reducer;
