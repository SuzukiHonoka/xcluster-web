import {createSlice, isAnyOf, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store.ts";
import {createAppAsyncThunk, request} from "../../app/api.ts";
import {APIResponse} from "../../models/api.ts";
import {Server} from "../../models/server.ts";

interface ServerState {
    servers: Server[];
    error?: string;
    status: string; //'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: ServerState = {
    servers: [
        {
            id: "1",
            name: "Server-1",
            groupID: 1,
            ip: "127.0.0.1",
            online: true,
            specs: "1 GB RAM, 2 Core CPU, 50GB DISK"
        },
        {
            id: "2",
            name: "Server-2",
            groupID: 1,
            ip: "127.0.0.2",
            online: true,
            specs: "2 GB RAM, 4 Core CPU, 50GB DISK"
        },
        {
            id: "3",
            name: "Server-3",
            groupID: 2,
            ip: "127.0.0.3",
            online: true,
            specs: "16 GB RAM, 16 Core CPU, 2TB DISK"
        },
        {
            id: "4",
            name: "Server-4",
            groupID: 1,
            ip: "127.0.0.5",
            online: true,
            specs: "1 GB RAM, 2 Core CPU, 50GB DISK"
        },
        {
            id: "5",
            name: "Server-5",
            groupID: 1,
            ip: "127.0.0.6",
            online: true,
            specs: "1 GB RAM, 2 Core CPU, 50GB DISK"
        }
    ],
    status: "idle",
}

export const fetchServers = createAppAsyncThunk<Server[]>(
    "servers/fetch",
    async (_, {rejectWithValue}) => {
        try {
            const response = await request.get<APIResponse>("/server/list");
            return response.data.data as Server[];
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);


const serversSlice = createSlice({
    name: "servers",
    initialState: initialState,
    reducers: {
        fEnable: (state, action) => {
            console.log(action)
            state.servers = state.servers.map((server) => server.id === action.payload ? {
                ...server,
                enabled: true
            } : server)
        },
        fDisable: (state, action) => {
            state.servers = state.servers.map((server) => server.id === action.payload ? {
                ...server,
                enabled: false
            } : server)
        },
        fShutdown: (state, action) => {
            state.servers = state.servers.map((server) => server.id === action.payload ? {
                ...server,
                online: false
            } : server)
        },
        fBoot: (state, action) => {
            state.servers = state.servers.map((server) => server.id === action.payload ? {
                ...server,
                online: true
            } : server)
        },
        removeServerByID: (state, action) => {
            state.servers = state.servers.filter((server) => server.id !== action.payload)
        },
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
            .addCase(fetchServers.fulfilled, (state, action: PayloadAction<Server[]>) => {
                state.status = "succeeded";
                state.servers = action.payload
                console.log("serversSlice(fetcServers<success>):", action);
            })
            .addMatcher(
                isAnyOf(fetchServers.pending),
                (state) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                isAnyOf(fetchServers.rejected),
                (state, action) => {
                    state.status = "failed"
                    state.error = action.payload
                    console.log("serversSlice(rejected):", action);
                }
            );
    }
})

export const selectServers = (state: RootState) => state.servers.servers;
export const selectError = (state: RootState) => state.servers.error;
export const selectStatus = (state: RootState) => state.servers.status;
export const selectServerById = (state: RootState, serverID?: string) =>
    serverID ? state.servers.servers.find(server => server.id === serverID) : undefined;
export const {reset, resetStatus, fShutdown, fBoot, removeServerByID} = serversSlice.actions

export default serversSlice.reducer