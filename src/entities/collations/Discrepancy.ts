import type { CollationRow } from "./CollationRow"

export type Discrepancy = {
    act1: CollationRow;
    act2: CollationRow;
    cellName: string;
}