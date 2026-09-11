export type Message = {
    id: string;
    chatId: string;
    type: string;
    content: string;
    isRedacted: boolean;
    createdAt: Date;
}