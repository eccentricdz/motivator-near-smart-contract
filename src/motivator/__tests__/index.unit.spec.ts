import { u128, VMContext } from "near-sdk-as";
import { ONE_NEAR } from "../../utils";
import { Contract } from "../assembly";

let motivator: Contract;
const contract = "motivator";
const nominee = "nominee";

beforeEach(() => {
  VMContext.setCurrent_account_id(contract);
  VMContext.setAccount_balance(ONE_NEAR);
  VMContext.setAttached_deposit(u128.Zero);
  motivator = new Contract();
});

describe("Contract", () => {
  it("omits the TVL", () => {
    expect(motivator.getTotalValueLocked()).toStrictEqual(u128.Zero);
  });

  it("registration requires a deposit of more than zero", () => {
    expect(motivator.registerPromise(1, nominee)).toStrictEqual(
      `Amount locked to the promise has to be greater than zero. Deposit attached to this call: ${u128.Zero}.`
    );
  });
});
