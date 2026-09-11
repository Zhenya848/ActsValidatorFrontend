import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./api";
import { logout, setAuthLoading, setCredentials } from "../../app/auth.slice";

export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, { dispatch }) => {
        try {
            dispatch(setAuthLoading());

            const response = await dispatch(
                authApi.endpoints.refresh.initiate()
            ).unwrap();

            if (!response.result) {
                throw new Error("Refresh response is empty");
            }

            dispatch(
                setCredentials({
                    accessToken: response.result.accessToken,
                    user: response.result.user,
                })
            );
        } 
        catch {
            dispatch(logout());
        }
    }
);