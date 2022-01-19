#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Assess if we get our amount back given we ran 2 kms so far in 2022."
echo ---------------------------------------------------------
echo

near call $CONTRACT assessReward '{"distanceRan":"2"}' --accountId $CONTRACT --gas 75000000000000

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Assess if we get our amount back given we ran 6 kms so far in 2022."
echo ---------------------------------------------------------
echo

near call $CONTRACT assessReward '{"distanceRan":"6"}' --accountId $CONTRACT --gas 75000000000000

echo
echo "now run the read-tvl script again to see changes made by this file"
exit 0
