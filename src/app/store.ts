import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};
// Use different key for each reducer in the future
// !IMPORTANT: filter status key
const configPersistConfig = {
  key: "config",
  storage,
  blacklist: ["status"],
};

const AuthPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["status", "user"],
};

const rootReducer = combineReducers({
  config: persistReducer(configPersistConfig, configReducer),
  auth: persistReducer(AuthPersistConfig, authReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
