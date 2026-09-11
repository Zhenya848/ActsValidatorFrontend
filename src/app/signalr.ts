import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import {store} from "./store";
import { CHATS_HUB_URL } from "./baseApi";

export const chatConnection: HubConnection =
  new HubConnectionBuilder()
      .withUrl(CHATS_HUB_URL, {
          accessTokenFactory: () =>
              store.getState().auth.accessToken ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Error)
      .build();