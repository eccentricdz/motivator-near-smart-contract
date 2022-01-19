import {
  Context,
  u128,
  PersistentMap,
  ContractPromiseBatch,
  logging,
} from "near-sdk-as";
import { AccountId, Amount, toYocto, XCC_GAS } from "../../utils";
import { Distance, PromiseToRun } from "./types";

@nearBindgen
export class Contract {
  // All the promises saved in this smart contract.
  private promisesToRun: PersistentMap<AccountId, PromiseToRun> =
    new PersistentMap("promisesToRun");

  // The total value locked.
  private totalValueLocked: Amount = u128.Zero;

  // Interestingly, the value persists across deployments!
  getTotalValueLocked(): Amount {
    return this.totalValueLocked;
  }

  /**
   * Registers the given promise and updates the total value locked.
   * Transfers the amount locked from the runners wallet to the contracts wallet.
   *
   * @param distance the distance runner promised to run in 2022.
   * @param nominee the nominee account where funds would be transferred if the promise is not kept.
   * @returns A string representing the result of function call.
   */
  @mutateState()
  registerPromise(distance: Distance, nominee: AccountId): string {
    const runner = Context.sender;
    const amountLocked = Context.attachedDeposit;

    assert(
      amountLocked > u128.Zero,
      `Amount locked to the promise has to be greater than zero. Deposit attached to this call: ${Context.attachedDeposit}.`
    );

    this.totalValueLocked = u128.add(this.totalValueLocked, amountLocked);

    this.promisesToRun.set(runner, { distance, nominee, amountLocked });
    return `Promise registered: ${runner} promises to run ${distance} kilometers in 2022 or lose ${amountLocked} + any accrued interests.`;
  }

  /**
   * Log the updated TVL.
   */
  @mutateState()
  onRunnerPayout(): void {
    this.assert_self();

    logging.log(
      `TVL updated: ${this.totalValueLocked}`
    );
  }

  /**
   * Assess if the runner is eligible to unlock his locked amount based on the distance they ran in 2022 so far.
   * Here we are relying on the caller to send in the distance ran, which could be fetched via the Strava / Google Fit API.
   * Admittedly this is centralized approach, but ideally the data should be made available by some oracle and the smart contract
   * can auto check the distance ran at pre-defined intervals.
   *
   * @param distanceRan the total distance ran by the runner in 2022 so far.
   * @returns a string representing the result of the function call.
   */
  @mutateState()
  assessReward(distanceRan: Distance): string {
    const runner = Context.sender;
    const runnersPromise = this.promisesToRun.get(runner);
    const self = Context.contractName;

    if (runnersPromise === null) {
      return `No promise registered for the runner ${runner}`;
    }

    const distance = runnersPromise.distance;
    const amountLocked = runnersPromise.amountLocked;

    if (distance <= distanceRan) {
      const toRunner = ContractPromiseBatch.create(runner);

      toRunner.transfer(amountLocked);
      toRunner
        .then(self)
        .function_call(
          "onRunnerPayout",
          `{}`,
          u128.Zero,
          XCC_GAS
        );
      this.promisesToRun.delete(runner);
      this.totalValueLocked = u128.sub(this.totalValueLocked, amountLocked);
      return `Well done ${runner}, ${amountLocked} NEAR is being transferred back to your account.`;
    } else {
      return `${runner} promised to run ${distance} kilometers but has ran only ${distanceRan}.`;
    }
  }

  private assert_self(): void {
    const caller = Context.predecessor;
    const self = Context.contractName;
    assert(caller == self, "Only this contract may call itself");
  }
}
