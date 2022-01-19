import { AccountId, Amount, Timestamp } from "../../utils";

/**
 * This interface reprents a promise made by a user,
 * to run [distance] kilometers in 2022, or lose [amountLocked]
 */
 @nearBindgen
export class PromiseToRun {
    amountLocked: Amount;
    distance: Distance;
    nominee: AccountId;
}

/**
 * Distance represented in the kilometers.
 */
export type Distance = u64;