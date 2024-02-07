import {createSlice, isAnyOf, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store.ts";
import {createAppAsyncThunk, request} from "../../app/api.ts";
import {APIResponse} from "../../models/api.ts";
import {Plugin} from "../../models/plugin.ts";
import { UsageData } from "../../models/plugin/usage.tsx";

interface PluginState {
    plugins: Plugin[];
    data?: UsageData | string
    serverID?: string
    error?: string;
    status: string; //'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: PluginState = {
    plugins: [
        {
            id: 1,
            name: "usage",
            description: "Inspect the server performance usage.",
            enabled: true
        },
        {
            id: 2,
            name: "access",
            description: "provides the server access infos.",
            enabled: true
        },
        {
            id: 3,
            name: "ssh-keys",
            description: "Inspect and manage the server ssh keys.",
            enabled: true
        },
        {
            id: 4,
            name: "network-ctl",
            description: "Inspect and manage the server network interfaces.",
            enabled: true
        }
    ],
    status: "idle",
}

export const fetchPlugins = createAppAsyncThunk<Plugin[]>(
    "plugins/fetch",
    async (_, {rejectWithValue}) => {
        try {
            const response = await request.get<APIResponse>("/plugin/list");
            return response.data.data as Plugin[];
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const pluginDisable = createAppAsyncThunk<Plugin, number>(
    "plugins/disable",
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await request.get<APIResponse>(`/plugin/${id}/disable`);
            return response.data.data as Plugin
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const pluginEnable = createAppAsyncThunk<Plugin, number>(
    "plugins/enable",
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await request.get<APIResponse>(`/plugin/${id}/enable`);
            return response.data.data as Plugin
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const pluginsSlice = createSlice({
    name: "plugins",
    initialState: initialState,
    reducers: {
        fEnable: (state, action) => {
            console.log(action)
            state.plugins = state.plugins.map((plugin) => plugin.id === action.payload ? {
                ...plugin,
                enabled: true
            } : plugin)
        },
        fDisable: (state, action) => {
            state.plugins = state.plugins.map((plugin) => plugin.id === action.payload ? {
                ...plugin,
                enabled: false
            } : plugin)
        },
        setData: (state, action) => {
            state.data = action.payload
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
            .addCase(fetchPlugins.fulfilled, (state, action: PayloadAction<Plugin[]>) => {
                state.status = "succeeded";
                state.plugins = action.payload
                console.log("pluginsSlice(fetchPlugins<success>):", action);
            })
            .addCase(pluginEnable.fulfilled, (state, action: PayloadAction<Plugin>) => {
                const {id} = action.payload
                state.plugins = state.plugins.map((plugin) => plugin.id === id ? action.payload : plugin)
                state.status = "succeeded";
                console.log("pluginsSlice(pluginEnable<success>):", action);
            })
            .addCase(pluginDisable.fulfilled, (state, action: PayloadAction<Plugin>) => {
                const {id} = action.payload
                state.plugins = state.plugins.map((plugin) => plugin.id === id ? action.payload : plugin)
                state.status = "succeeded";
                console.log("pluginsSlice(pluginDisable<success>):", action);
            })
            .addMatcher(
                isAnyOf(fetchPlugins.pending, pluginEnable.rejected, pluginDisable.rejected),
                (state) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                isAnyOf(fetchPlugins.rejected, pluginEnable.rejected, pluginDisable.rejected),
                (state, action) => {
                    state.status = "failed"
                    state.error = action.payload
                    console.log("pluginsSlice(rejected):", action);
                }
            );
    }
})

export const selectPlugins = (state: RootState) => state.plugins.plugins;
export const selectError = (state: RootState) => state.plugins.error;
export const selectStatus = (state: RootState) => state.plugins.status;
export const selectUserById = (state: RootState, pluginID: number) =>
    state.plugins.plugins.find(plugin => plugin.id === pluginID);
export const selectServerID = (state: RootState) => state.plugins.serverID
export const selectData = (state: RootState) => state.plugins.data
export const {reset, resetStatus, fEnable, fDisable, setData} = pluginsSlice.actions

export default pluginsSlice.reducer