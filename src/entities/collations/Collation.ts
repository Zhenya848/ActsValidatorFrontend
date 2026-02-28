import type { AiRequest } from "./AiRequest";
import type { Discrepancy } from "./Discrepancy";

export type Collation = {
    id: string;
    userId: string;
    act1Name: string;
    act2Name: string;
    discrepancies: Discrepancy[];
    aiRequest?: AiRequest;
}