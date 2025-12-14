#!/bin/bash

# Quick execution script for package-lock.json regeneration
# Run this when Node.js is available

set -e

echo "========================================"
echo "Package Lock Fix - Quick Execution"
echo "========================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed"
    echo ""
    echo "Please install Node.js 16.x or 18.x first:"
    echo "  - Ubuntu/Debian: sudo apt-get install -y nodejs npm"
    echo "  - Amazon Linux: sudo yum install -y nodejs npm"
    echo "  - macOS: brew install node"
    echo ""
    echo "Or use GitHub Actions: git checkout -b fix/package-lock && git push -u origin fix/package-lock"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Execute regeneration
echo "🔄 Running regeneration script..."
./regenerate-lockfile.sh

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ SUCCESS!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Review the changes: git diff package-lock.json"
    echo "2. Commit: git add package-lock.json"
    echo "3. Commit: git commit -m 'fix: regenerate package-lock.json to resolve npm ci failures'"
    echo "4. Push: git push"
    echo ""
    echo "Or run this one-liner:"
    echo "git add package-lock.json && git commit -m 'fix: regenerate package-lock.json' && git push"
else
    echo ""
    echo "❌ Regeneration failed"
    echo "Check the output above for errors"
    exit 1
fi
