import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createAppAsyncThunk, request } from "../../app/api";
import { User } from "../../models/user";
import { APIResponse } from "../../models/api";

interface AuthState {
  isAuthenticated?: boolean;
  remember?: boolean;
  error?: string; // do not cache this!!
  user?: User; // do not cache this!!
  status: string; //'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: AuthState = {
  status: "idle",
};

export type UserCredential = {
  email: string;
  password: string;
};

export const userLogin = createAppAsyncThunk<User, UserCredential>(
  "user/login",
  async (credential: UserCredential, { rejectWithValue }) => {
    try {
      const response = await request.post("/user/login", credential);
      if (response.status !== 200) {
        return rejectWithValue(`${response.status}: ${response.statusText}`);
      }
      return response.data.code === 200
        ? response.data
        : rejectWithValue(response.data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const userLogout = createAppAsyncThunk<void>(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get("/user/logout");
      if (response.status !== 200) {
        return rejectWithValue(`${response.status}: ${response.statusText}`);
      }
      return response.data.code === 200
        ? response.data
        : rejectWithValue(response.data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const userCheck = createAppAsyncThunk(
  "user/info",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get("/user/info");
      if (response.status !== 200) {
        return rejectWithValue(`${response.status}: ${response.statusText}`);
      }
      return response.data.code === 200
        ? response.data
        : rejectWithValue(response.data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setRemember: (state, action: PayloadAction<boolean>) => {
      state.remember = action.payload;
      console.log("remember:", action.payload);
    },
    setExpired: () => {
      return { ...initialState };
    },
    check: (state) => {
      console.log("check");
      // bypass check if user has not logged in before
      if (!state.isAuthenticated) return;
      // check if session valid,
      // if not, set finished to false and redirect to login page
    },
  },
  extraReducers(buidler) {
    buidler
      // User Login
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
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action): action is PayloadAction<APIResponse, string> =>
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload.message ?? action.payload;
          console.log("authSlice(rejected):", action);
        }
      );
  },
});

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectError = (state: RootState) => state.auth.error;
export const selectStatus = (state: RootState) => state.auth.status;

export const { setRemember, setExpired: setExpired } = authSlice.actions;

export default authSlice.reducer;
