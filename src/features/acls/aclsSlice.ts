import {createSlice, isAnyOf, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store.ts";
import {createAppAsyncThunk, request} from "../../app/api.ts";
import {APIResponse} from "../../models/api.ts";

interface ACLState {
    acls: ACL[];
    error?: string;
    status: string; //'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: ACLState = {
    acls: [
        {
            id: 1,
            name: "Allow All",
            mode: 1,
            srcType: "ip",
            src: "0.0.0.0",
            enabled: true
        }
    ],
    status: "idle",
}

export const fetchACLs = createAppAsyncThunk<ACL[]>(
    "acls/fetch",
    async (_, {rejectWithValue}) => {
        try {
            const response = await request.get<APIResponse>("/acl/list");
            return response.data.data as ACL[];
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const aclsSlice = createSlice({
    name: "acls",
    initialState: initialState,
    reducers: {
        reset: () => {
            return {...initialState};
        },
        resetStatus: (state) => {
            state.status = "idle";
            console.log("usersSlice => resetStatus");
        },
        fEnable: (state, action) => {
            console.log(action)
            state.acls = state.acls.map((acl) => acl.id === action.payload ? {
                ...acl,
                enabled: true
            } : acl)
        },
        fDisable: (state, action) => {
            state.acls = state.acls.map((acl) => acl.id === action.payload ? {
                ...acl,
                enabled: false
            } : acl)
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchACLs.fulfilled, (state, action: PayloadAction<ACL[]>) => {
                state.status = "succeeded";
                state.acls = action.payload
                console.log("aclsSlice(fetchacls<success>):", action);
            })
            .addMatcher(
                isAnyOf(fetchACLs.pending),
                (state) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                isAnyOf(fetchACLs.rejected),
                (state, action) => {
                    state.status = "failed"
                    state.error = action.payload
                    console.log("aclsSlice(rejected):", action);
                }
            );
    }
})

export const selectAcls = (state: RootState) => state.acls.acls;
export const selectError = (state: RootState) => state.acls.error;
export const selectStatus = (state: RootState) => state.acls.status;
export const selectAclById = (state: RootState, aclID: number) =>
    state.acls.acls.find(acl => acl.id === aclID);
export const {reset, resetStatus, fEnable, fDisable} = aclsSlice.actions

export default aclsSlice.reducer