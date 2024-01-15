import {createSlice, isAnyOf, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../models/user";
import {RootState} from "../../app/store";
import {createAppAsyncThunk, request} from "../../app/api.ts";
import {APIResponse} from "../../models/api.ts";

interface UserState {
    users: User[];
    error?: string;
    status: string; //'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: UserState = {
    users: [],
    status: "idle",
}

export const fetchUsers = createAppAsyncThunk<User[]>(
    "users/fetch",
    async (_, {rejectWithValue}) => {
        try {
            const response = await request.get<APIResponse>("/user/list");
            return response.data.data as User[];
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export type UpdateInfo = {
    id: number;
    name?: string;
    email?: string;
    password?: string
};

export const userUpdate = createAppAsyncThunk<User, UpdateInfo>(
    "users/update",
    async (updateInfo: UpdateInfo, {rejectWithValue}) => {
        try {
            const response = await request.put<APIResponse>(`/user/update/${updateInfo.id}`, updateInfo);
            return response.data.data as User
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const userDelete = createAppAsyncThunk<User, number>(
    "users/delete",
    async (userID: number, {rejectWithValue}) => {
        try {
            const response = await request.delete<APIResponse>(`/user/delete/${userID}`);
            return response.data.data as User
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const usersSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
        reset: () => {
            return {...initialState};
        },
        resetStatus: (state) => {
            state.status = "idle";
            console.log("usersSlice => resetStatus");
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.status = "succeeded";
                state.users = action.payload
                console.log("usersSlice(fetchUsers<success>):", action);
            })
            .addCase(userUpdate.fulfilled, (state, action: PayloadAction<User>) => {
                const {id} = action.payload
                state.users = state.users.map((user) => user.id === id ? action.payload : user)
                state.status = "succeeded";
                console.log("usersSlice(userUpdate<success>):", action);
            })
            .addCase(userDelete.fulfilled, (state, action: PayloadAction<User>) => {
                const {id} = action.payload
                state.users = state.users.filter((user => user.id !== id))
                state.status = "succeeded";
                console.log("usersSlice(userDelete<success>):", action);
            })
            .addMatcher(
                isAnyOf(fetchUsers.pending, userUpdate.rejected, userDelete.rejected),
                (state) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                isAnyOf(fetchUsers.rejected, userUpdate.rejected, userDelete.rejected),
                (state, action) => {
                    state.status = "failed"
                    state.error = action.payload
                    console.log("usersSlice(rejected):", action);
                }
            );
    }
})

export const selectUsers = (state: RootState) => state.users.users;
export const selectError = (state: RootState) => state.users.error;
export const selectStatus = (state: RootState) => state.users.status;
export const selectUserById = (state: RootState, userID: number) =>
    state.users.users.find(user => user.id === userID);
export const {reset, resetStatus} = usersSlice.actions

export default usersSlice.reducer