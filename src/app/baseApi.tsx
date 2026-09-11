import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AppState } from "./store";
import type { Envelope } from "../shared/api/Envelope";
import type { LoginResponse } from "../features/accounts/responses/LoginResponse";
import { setCredentials } from "./auth.slice";
import { Mutex } from "async-mutex";

export const ACTS_SERVICE_API_URL = "/api/Acts/"
export const USER_SERVICE_API_URL = "/api/Auth/";
export const PAYMENT_SERVICE_API_URL = "/api/Payments/";
export const CHATS_SERVICE_API_URL = "/api/Chats/";
export const CHATS_HUB_URL = "/hubs/chat";

const baseQuery = fetchBaseQuery({
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as AppState).auth.accessToken;

        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }

        return headers;
    }
});

const mutex = new Mutex();

const baseQueryWithRefresh: typeof baseQuery = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let response = await baseQuery(args, api, extraOptions);
    const isRefreshCall = typeof args !== "string" && args.url?.includes("refresh-token");

    if (response.error && response.error.status === 401 && !isRefreshCall) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const authResponse = await baseQuery(
                    {
                        url: USER_SERVICE_API_URL + "refresh-token",
                        method: "POST"
                    },
                    api,
                    extraOptions
                );

                if (authResponse.error) {
                    window.location.href = '/login';

                    return response;
                }

                const data = authResponse.data as Envelope<LoginResponse>;

                api.dispatch(setCredentials({ accessToken: data.result!.accessToken, user: data.result!.user }))

                response = await baseQuery(args, api, extraOptions);
            }
            finally {
                release();
            }
        }
        else {
            await mutex.waitForUnlock();
            response = await baseQuery(args, api, extraOptions);
        }
    }

    return response;
}

export const baseApi = createApi({
    baseQuery: baseQueryWithRefresh,
    endpoints: () => ({}),
    tagTypes: ["Acts"]
})