import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SignalRStatus =
    | "disconnected"
    | "connecting"
    | "connected";

interface SignalRState {
    status: SignalRStatus;
}

const initialState: SignalRState = {
    status: "disconnected",
};

const signalRSlice = createSlice({
    name: "signalR",
    initialState,
    selectors: {
        selectSignalRStatus: (state) => state.status
    },
    reducers: {
        setSignalRStatus: (
            state,
            action: PayloadAction<SignalRStatus>
        ) => {
            state.status = action.payload;
        },
    },
});

export const { setSignalRStatus } = signalRSlice.actions;
export const { selectSignalRStatus } = signalRSlice.selectors;

export default signalRSlice.reducer;