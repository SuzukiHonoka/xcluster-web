import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useContext } from "react";
import ColorModeContext from "../contexts/ColorModeProvider";
import AlertContext from "../contexts/AlertProvider";
import DialogContext from "../contexts/DialogProvider";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useColorMode = () => useContext(ColorModeContext);
export const useAlert = () => useContext(AlertContext).showAlert;
export const useDialog = () => useContext(DialogContext).showDialog;
