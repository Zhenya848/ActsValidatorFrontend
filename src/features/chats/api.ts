import { baseApi, CHATS_SERVICE_API_URL } from "../../app/baseApi";
import type { Chat } from "../../entities/chats/Chat";
import type { Message } from "../../entities/chats/Message";
import type { Envelope } from "../../shared/api/Envelope";
import type { PageList } from "../../shared/api/PageList";

export const chatsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation<Envelope<Message>, { message: string, chatId?: string, connectionId?: string }>({
            query: ({ message, chatId, connectionId }) => ({
                url: CHATS_SERVICE_API_URL + "send",
                body: { message, chatId, connectionId },
                method: "POST"
            }),
        }),
        getChatsByPagination: builder.query<PageList<Chat>, { page: number, pageSize: number, searchByName?: string }>({
            query: ({ page, pageSize, searchByName }) => ({
                url: CHATS_SERVICE_API_URL + `get-by-pagination?page=${page}&pageSize=${pageSize}` + (searchByName ? `&searchByName=${searchByName}` : ""),
                method: "GET"
            }),
        }),
        getChat: builder.query<Envelope<Chat>, void>({
            query: () => ({
                url: CHATS_SERVICE_API_URL + "get",
                method: "GET"
            }),
        })
    })
});

export const { 
    useGetChatsByPaginationQuery,
    useSendMessageMutation,
    useGetChatQuery
} = chatsApi;