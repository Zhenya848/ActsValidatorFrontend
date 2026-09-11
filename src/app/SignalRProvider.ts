import { useEffect } from "react";
import { selectAuthStatus } from "./auth.slice";
import { useAppDispatch, useAppSelector } from "./store";
import { chatConnection } from "./signalr";
import { setSignalRStatus } from "./signalr.slice";
import { HubConnectionState } from "@microsoft/signalr/dist/esm/HubConnection";

export function SignalRProvider() {
    const authStatus = useAppSelector(selectAuthStatus);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (authStatus !== "succeeded") {
            if (chatConnection.state !== HubConnectionState.Disconnected) {
                chatConnection.stop();
            }

            dispatch(setSignalRStatus("disconnected"));
            return;
        }

        if (chatConnection.state !== HubConnectionState.Disconnected) {
            return;
        }

        const start = async () => {
            dispatch(setSignalRStatus("connecting"));

            try {
                await chatConnection.start();

                dispatch(setSignalRStatus("connected"));
            } 
            catch (error) {
                dispatch(setSignalRStatus("disconnected"));
                console.error(error);
            }
        };

        start();

        return () => {
            chatConnection.stop();
            dispatch(setSignalRStatus("disconnected"));
        };
    }, [authStatus, dispatch]);

    return null;
}