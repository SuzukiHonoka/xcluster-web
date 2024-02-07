import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import configReducer from "../features/config/configSlice";
import authReducer from "../features/auth/authSlice";
import registerReducer from "../features/register/registerSlice";
import usersReducer from "../features/users/usersSlice.ts";
import pluginsReducer from "../features/plugins/pluginsSlice.ts";
import serversReducer from "../features/server/serverSlice.ts"
import aclsReducer from "../features/acls/aclsSlice.ts"
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["config", "auth", "register", "users", "plugins", "servers"],
};

// !IMPORTANT: filter status key
const configPersistConfig = {
    key: "config",
    storage,
    blacklist: ["status"],
};

const AuthPersistConfig = {
    key: "auth",
    storage,
    blacklist: ["status", "error", "isAuthenticated", "user"],
};

const RegisterPersistConfig = {
    key: "register",
    storage,
    blacklist: ["status", "error"],
};

const UsersPersistConfig = {
    key: "users",
    storage,
    blacklist: ["status", "error", "users"],
};

const PluginsPersistConfig = {
    key: "plugins",
    storage,
    blacklist: ["status", "error", "data"], // "plugins"
}

const ServersPersistConfig = {
    key: "servers",
    storage,
    blacklist: ["status", "error"], // "servers"
}

const AclsPersistConfig = {
    key: "acls",
    storage,
    blacklist: ["status", "error"], // "acls"
}

const RootReducer = combineReducers({
    config: persistReducer(configPersistConfig, configReducer),
    auth: persistReducer(AuthPersistConfig, authReducer),
    register: persistReducer(RegisterPersistConfig, registerReducer),
    users: persistReducer(UsersPersistConfig, usersReducer),
    plugins: persistReducer(PluginsPersistConfig, pluginsReducer),
    servers: persistReducer(ServersPersistConfig, serversReducer),
    acls: persistReducer(AclsPersistConfig, aclsReducer),
});

const persistedReducer = persistReducer(persistConfig, RootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export const Rest = () => {
    persistor.purge().then(() => {
        persistor.flush().then(() => {
            persistor.pause();
            persistor.persist();
        });
    });
};
