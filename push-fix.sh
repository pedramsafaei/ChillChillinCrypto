#!/bin/bash

# Script to push the package-lock.json fix when network access is available
# This will trigger the automated GitHub Actions workflow

set -e

echo "======================================"
echo "Package Lock Fix - Push to GitHub"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "ERROR: Not in the project root directory"
    echo "Please run this script from the ChillChillinCrypto directory"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "fix/package-lock" ]; then
    echo ""
    echo "WARNING: Not on fix/package-lock branch"
    echo "Switching to fix/package-lock branch..."
    git checkout fix/package-lock || {
        echo "ERROR: Could not switch to fix/package-lock branch"
        echo "The branch may not exist yet."
        exit 1
    }
fi

echo ""
echo "Checking git status..."
git status

echo ""
echo "Ready to push to origin/fix/package-lock"
echo "This will trigger the GitHub Actions workflow to regenerate package-lock.json"
echo ""
read -p "Continue with push? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Pushing to origin..."
    git push -u origin fix/package-lock
    
    echo ""
    echo "======================================"
    echo "✅ Push completed successfully!"
    echo "======================================"
    echo ""
    echo "Next steps:"
    echo "1. Go to GitHub Actions: https://github.com/pedramsafaei/ChillChillinCrypto/actions"
    echo "2. Watch the 'Regenerate Package Lock File' workflow"
    echo "3. Wait for it to complete (5-10 minutes)"
    echo "4. Verify CI/CD tests pass"
    echo "5. Merge the fix/package-lock branch to main"
    echo ""
else
    echo ""
    echo "Push cancelled."
    echo "Run this script again when ready to push."
fi
