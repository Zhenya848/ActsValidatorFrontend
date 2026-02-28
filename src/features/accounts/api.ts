import type { LoginResponse } from "./responses/LoginResponse";
import { baseApi, USER_SERVICE_API_URL } from "../../app/baseApi";
import type { Envelope } from "../../shared/api/Envelope";
import type { User } from "../../entities/accounts/User";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<Envelope<string>, { userName: string, email: string, password: string }>({
            query: ({ userName, email, password }) => ({
                url: USER_SERVICE_API_URL + "registration",
                body: { userName, email, password },
                method: "POST"
            })
        }),

        login: builder.mutation<Envelope<LoginResponse>, { email: string, password: string }>({
            query: ({ email, password }) => ({
                url: USER_SERVICE_API_URL + "login",
                body: { email, password },
                method: "POST"
            }),
            invalidatesTags: ["Acts"]
        }),

        refresh: builder.mutation<Envelope<LoginResponse>, void>({
            query: () => ({
                url: USER_SERVICE_API_URL + "refresh-token",
                method: "POST"
            })
        }),

        logout: builder.mutation<Envelope<LoginResponse>, void>({
            query: () => ({
                url: USER_SERVICE_API_URL + "logout",
                method: "POST"
            })
        }),

        sayHello: builder.query<string, void>({
            query: () => ({
                url: USER_SERVICE_API_URL + "say-hello",
                method: "GET"
            })
        })
    })
});

export const { 
    useRegisterMutation,
    useLoginMutation,
    useRefreshMutation,
    useLogoutMutation,
    useSayHelloQuery
 } = authApi;