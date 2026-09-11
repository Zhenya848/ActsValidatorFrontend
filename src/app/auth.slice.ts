import type { User } from "../entities/accounts/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

export type AuthState = {
    accessToken: string | undefined;
    user: User | undefined;
    isAuthenticated: boolean;
    authStatus: AuthStatus;
}

const initialAuthState: AuthState = {
    accessToken: undefined,
    user: undefined,
    isAuthenticated: false,
    authStatus: "idle"
}

interface SetCredentialsPayload {
  user?: User;
  accessToken?: string;
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    selectors: {
        selectAccessToken: (state) => state.accessToken,
        selectIsAuthenticated: (state) => state.isAuthenticated,
        selectUser: (state) => state.user,
        selectAuthStatus: (state) => state.authStatus
    },
    reducers: {
        setCredentials: (state, { payload }: PayloadAction<SetCredentialsPayload>) => {
            if (payload.accessToken) {
                state.accessToken = payload.accessToken;
            }

            if (payload.user) {
                state.user = payload.user;
            }

            if (payload.user || payload.accessToken) {
                state.isAuthenticated = true;
                state.authStatus = "succeeded";
            }
        },

        setAuthLoading: (state) => {
            state.authStatus = "loading";
        },

        logout: (state) => {
            state.accessToken = undefined;
            state.isAuthenticated = false;
            state.authStatus = "idle";
            state.user = undefined;
        }
    }
})

export const { setCredentials, logout, setAuthLoading } = authSlice.actions;
export const { selectAccessToken, selectAuthStatus, selectUser, selectIsAuthenticated } = authSlice.selectors;

export default authSlice.reducer;