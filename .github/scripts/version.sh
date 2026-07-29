#!/usr/bin/env bash

# SelfOS Semantic Versioning & Conventional Commits Release Script
# Senior DevOps Release Automation Script

set -e

DRY_RUN=false
if [ "$1" == "--dry-run" ]; then
  DRY_RUN=true
fi

echo "======================================================="
echo "       SelfOS Automated Semantic Versioning            "
echo "======================================================="

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version in package.json: $CURRENT_VERSION"

# Fetch latest git tag or default to v1.0.0
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v$CURRENT_VERSION")
echo "Latest Git tag: $LATEST_TAG"

# Analyze commits since last tag
COMMITS=$(git log "$LATEST_TAG..HEAD" --oneline 2>/dev/null || git log --oneline -n 10)

BUMP_TYPE="patch"

if echo "$COMMITS" | grep -qE "BREAKING CHANGE|breaking:"; then
  BUMP_TYPE="major"
elif echo "$COMMITS" | grep -qE "^[a-f0-9]+ feat(\(.*\))?:"; then
  BUMP_TYPE="minor"
fi

echo "Determined semantic version bump type: $BUMP_TYPE"

# Parse major, minor, patch
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case $BUMP_TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
NEW_TAG="v$NEW_VERSION"

echo "New target version: $NEW_VERSION (Tag: $NEW_TAG)"

if [ "$DRY_RUN" == true ]; then
  echo "\n[Dry Run] Skipping git tag creation and package.json update."
  exit 0
fi

# Update package.json version
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "✓ Updated package.json version to $NEW_VERSION"

# Create annotated Git tag
git tag -a "$NEW_TAG" -m "Release $NEW_TAG - SelfOS Production Build"
echo "✓ Created git tag: $NEW_TAG"

echo "\n======================================================="
echo "  ✓ VERSIONING COMPLETE: $NEW_TAG                      "
echo "======================================================="
