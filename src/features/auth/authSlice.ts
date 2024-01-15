import {PayloadAction, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {createAppAsyncThunk, request} from "../../app/api";
import {User} from "../../models/user";
import {APIResponse} from "../../models/api.ts";

interface AuthState {
    isAuthenticated?: boolean;
    remember?: boolean; // cache this
    user?: User;
    error?: string;
    status: string; //'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: AuthState = {
    status: "idle",
};

export type UserCredential = {
    name?: string; // do not use this field for authentication
    email: string;
    password: string;
};

export const userLogin = createAppAsyncThunk<User, UserCredential>(
    "auth/login",
    async (credential: UserCredential, {rejectWithValue}) => {
        try {
            const response = await request.post<APIResponse>("/user/login", credential);
            return response.data.data as User;
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const userLogout = createAppAsyncThunk<void, void>(
    "auth/logout",
    async (_, {rejectWithValue}) => {
        try {
            await request.get("/user/logout");
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const userRecovery = createAppAsyncThunk<User, void>(
    "auth/info",
    async (_, {rejectWithValue}) => {
        try {
            const response = await request.get<APIResponse>("/user/info");
            return response.data.data as User;
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setRemember: (state, action: PayloadAction<boolean>) => {
            state.remember = action.payload;
            console.log("remember:", action.payload);
        },
        reset: () => {
            return {...initialState};
        },
        resetStatus: (state) => {
            state.status = "idle";
            console.log("authSlice => resetStatus");
        },
    },
    extraReducers(builder) {
        builder
            .addCase(userLogin.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(userLogout.fulfilled, () => {
                return {
                    ...initialState,
                    isAuthenticated: false,
                    status: "succeeded",
                };
            })
            .addCase(userRecovery.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.user = action.payload;
                console.log("authSlice(userRecovery<success>):", action);
            })
            .addMatcher(
                isAnyOf(userLogin.pending, userLogout.pending, userRecovery.pending),
                (state) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                isAnyOf(userLogin.rejected, userLogout.rejected, userRecovery.rejected),
                (_state, action) => {
                    console.log("authSlice(rejected):", action);
                    return {
                        ...initialState,
                        error: action.payload,
                        isAuthenticated: false,
                        status: "failed",
                    };
                }
            );
    },
});

export const selectRemember = (state: RootState) => state.auth.remember;
export const selectIsAuthenticated = (state: RootState) =>
    state.auth.isAuthenticated;
export const selectError = (state: RootState) => state.auth.error;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectIsAdmin = (state: RootState) => state.auth.user?.groupID === 1

export const {setRemember, reset, resetStatus} = authSlice.actions;

export default authSlice.reducer;
