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
echo "Step 1: Register a promise to run 5 kms or lose 2 NEAR."
echo ---------------------------------------------------------
echo

near call $CONTRACT registerPromise '{"distance":"5", "nominee": "nominee"}' --accountId $CONTRACT --amount 2

echo
echo "now run the read-tvl script again to see changes made by this file"
exit 0
