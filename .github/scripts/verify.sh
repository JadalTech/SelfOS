#!/usr/bin/env bash

# SelfOS Root Application Fail-Fast Verification Script
# Senior DevOps Pipeline Audit Runner

set -e # Exit immediately on first failing command

echo "======================================================="
echo "   SelfOS Application Quality Gate Verification        "
echo "======================================================="

echo "[1/4] Checking NPM Lockfile Integrity..."
if [ ! -f "package-lock.json" ]; then
  echo "Error: package-lock.json missing!"
  exit 1
fi
echo "✓ Lockfile verified."

echo "\n[2/4] Running TypeScript Strict Verification..."
npx tsc --noEmit
echo "✓ TypeScript type checking passed with 0 errors."

echo "\n[3/4] Running ESLint Static Analysis..."
npx expo lint
echo "✓ ESLint verification passed with 0 errors."

echo "\n[4/4] Executing Core Unit, Repository & React Query Test Suites..."
npx tsx src/shared/utils/__tests__/validators.test.ts
npx tsx src/shared/utils/__tests__/mappers.test.ts
npx tsx src/shared/offline/__tests__/offline-infrastructure.test.ts
npx tsx src/shared/notifications/__tests__/notifications.test.ts
npx tsx src/shared/observability/__tests__/observability.test.ts
npx tsx __tests__/repository/routine.repository.test.ts
npx tsx __tests__/react-query/react-query.test.ts
npx tsx __tests__/e2e/e2e-suite.test.ts

echo "\n======================================================="
echo "  ✓ ALL APP QUALITY GATES PASSED SUCCESSFULLY!          "
echo "======================================================="
