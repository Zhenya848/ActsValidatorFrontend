import type { Discrepancy } from "./Discrepancy";

export type AiRequest = {
    id: string;
    collationId: string;
    status: string;
    discrepancies: Discrepancy[];
    errorMessage?: string;
}