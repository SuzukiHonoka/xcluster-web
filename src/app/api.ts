import axios from "axios";
import { API_URL } from "./config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIResponse } from "../models/api";
import { RootState } from "./store";

export const request = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  rejectValue: APIResponse | string;
}>();
