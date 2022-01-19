# `motivator` smart contract.

This is my first ever smart contact ✨ as part of the [NEAR University](https://www.near.university/) certification program.

## Ideation

You lock in some amount in a smart contract with a promise of running a certain distance in the year 2022.
The smart contract release the money back to the _caller / runner / sender_ account if the `assessReward` function is called with a distance greater than
or equal to what was promised. At the end of the year, the smart contract goes through all the unfulfilled promised and sends the amount locked to the nominee account which was declared as part of the promise registration.

The idea here is that when our motivations levels are high we can promise ourselves to achieve something (run a certain distance in case of this smart contract), and lock a certain amount. Given the fact that we would only get this money back if we fulfill our promise, it would incentivize us to not give up. We could further enhance the incentive by adding someone we don't particularly admire as the nominee account (say the election fund of the party we do not support).

## Functions

- `getTotalValueLocked`: Get the total amount locked in the smart contract across all promises.
- `registerPromise`: Register a promise to run a certain distance and the nominee account that recieves the money in case we do not fullfill our promise.
- `assessReward`: Assess if the locked amount should be released based on the distance ran so far. Here we are relying on the caller to send in the distance ran, which could be fetched via the Strava / Google Fit API. Admittedly this is centralized approach, but ideally the data should be made available by some oracle and the smart contract can auto check the distance ran at pre-defined intervals.


## Usage

Install `NEAR CLI` first like this: `npm i -g near-cli`

1. clone this repo to a local folder
2. run `yarn`
3. run `./scripts/1.dev-deploy.sh`
3. run `./scripts/2.read-tvl.sh`
4. run `./scripts/3.register-promise.sh`
5. run `./scripts/4.assess-reward.sh`
6. run `./scripts/5.cleanup.sh`

## Contact

Check out my other projects at https://edz.vercel.app/