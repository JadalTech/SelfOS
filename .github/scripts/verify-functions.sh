#!/usr/bin/env bash

# SelfOS Cloud Functions & Rules Fail-Fast Verification Script
# Senior DevOps Pipeline Audit Runner

set -e

echo "======================================================="
echo "   SelfOS Cloud Functions Quality Gate Verification     "
echo "======================================================="

echo "[1/4] Verifying Cloud Functions Build & Types..."
cd functions
npm run build
cd ..
echo "✓ Functions TypeScript build clean."

echo "\n[2/4] Executing Cloud Functions Core Unit Tests..."
npx tsx functions/__tests__/functions.test.ts
npx tsx functions/__tests__/unit/callable-functions.test.ts
echo "✓ Functions callable unit tests passed."

echo "\n[3/4] Executing Idempotency & Lock Guard Tests..."
npx tsx functions/__tests__/unit/idempotency.test.ts
echo "✓ Idempotency tests passed."

echo "\n[4/4] Verifying Firestore Security Rules Matrix..."
npx tsx src/shared/firebase/__tests__/firestore.rules.test.ts
echo "✓ Firestore security rules verification passed."

echo "\n======================================================="
echo "  ✓ ALL FUNCTIONS QUALITY GATES PASSED SUCCESSFULLY!    "
echo "======================================================="
