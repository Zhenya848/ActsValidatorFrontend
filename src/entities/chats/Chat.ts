import type { Message } from "./Message";

type UserData = {
    id: string;
    name: string;
    email: string;
}

export type Chat = {
    id: string;
    user: UserData;
    messages: Message[];
}