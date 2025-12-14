#!/bin/bash

# Fix npm ci failures caused by package.json and package-lock.json mismatch
# This script regenerates package-lock.json with all dependencies

set -e

echo "========================================="
echo "Fix npm CI Package Lock Mismatch"
echo "========================================="
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed"
    echo "Please install Node.js and npm first"
    echo ""
    echo "Installation options:"
    echo "  - Using nvm: nvm install 18 && nvm use 18"
    echo "  - Amazon Linux: sudo yum install -y nodejs npm"
    echo "  - Ubuntu/Debian: sudo apt-get install -y nodejs npm"
    echo "  - macOS: brew install node"
    echo "  - Docker: docker run -v \$(pwd):/app -w /app node:18-alpine sh"
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Backup existing lock file
if [ -f "package-lock.json" ]; then
    BACKUP_FILE="package-lock.json.backup-$(date +%Y%m%d_%H%M%S)"
    echo "Creating backup: $BACKUP_FILE"
    cp package-lock.json "$BACKUP_FILE"
    echo "Removing old package-lock.json"
    rm -f package-lock.json
fi

# Remove node_modules if present
if [ -d "node_modules" ]; then
    echo "Removing node_modules directory"
    rm -rf node_modules
fi

# Clean npm cache
echo "Cleaning npm cache"
npm cache clean --force

echo ""
echo "Regenerating package-lock.json..."
echo "This may take a few minutes..."
echo ""

# Regenerate package-lock.json
npm install

echo ""
echo "Verifying the fix with npm ci..."
npm ci

echo ""
echo "Running tests to verify everything works..."
npm test

echo ""
echo "========================================="
echo "✓ SUCCESS!"
echo "========================================="
echo ""
echo "package-lock.json has been successfully regenerated"
echo "All dependencies are now properly synchronized"
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff package-lock.json"
echo "2. Commit the changes: git add package-lock.json && git commit -m 'fix: regenerate package-lock.json'"
echo "3. Push to repository: git push"
echo ""
