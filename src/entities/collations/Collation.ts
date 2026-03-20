import type { Discrepancy } from "./Discrepancy";

export type Collation = {
    id: string;
    userId: string;
    act1Name: string;
    act2Name: string;
    coincidencesCount: number;
    rowsProcessed: number;
    collationErrors: Discrepancy[];
    status: "Success" | "Warning" | "Error",
    aiRequestStatus: "Pending" | "Completed" | "Failed",
    createdAt: Date
}