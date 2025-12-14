#!/bin/bash

# Script to regenerate package-lock.json
# This fixes the CI/CD pipeline failures caused by missing dependencies and version mismatches

set -e

echo "================================"
echo "Package Lock File Regeneration"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 16.x or 18.x to proceed"
    echo ""
    echo "Installation options:"
    echo "  - Amazon Linux: sudo yum install -y nodejs npm"
    echo "  - Ubuntu/Debian: sudo apt-get install -y nodejs npm"
    echo "  - macOS: brew install node"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed"
    echo "Please install npm to proceed"
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Backup existing lock file if it exists
if [ -f "package-lock.json" ]; then
    echo "Backing up existing package-lock.json..."
    cp package-lock.json "package-lock.json.backup.$(date +%Y%m%d_%H%M%S)"
    rm -f package-lock.json
    echo "Old package-lock.json removed"
fi

# Clean npm cache to ensure fresh install
echo ""
echo "Cleaning npm cache..."
npm cache clean --force

# Remove node_modules if it exists
if [ -d "node_modules" ]; then
    echo "Removing existing node_modules..."
    rm -rf node_modules
fi

# Regenerate package-lock.json
echo ""
echo "Regenerating package-lock.json..."
echo "This may take a few minutes..."
npm install

# Verify the installation
echo ""
echo "Verifying installation..."
if [ -f "package-lock.json" ]; then
    echo "✓ package-lock.json has been successfully regenerated"
    echo ""
    
    # Check for the previously reported issues
    echo "Checking for previously missing dependencies..."
    
    MISSING_DEPS=0
    for dep in "color-convert" "color-name" "get-stream" "human-signals" "pump" "end-of-stream" "has-flag" "npm-run-path" "onetime" "strip-final-newline" "cli-truncate" "eventemitter3" "log-update" "wrap-ansi" "slice-ansi" "string-width" "ansi-escapes" "cli-cursor" "strip-ansi" "type-fest" "restore-cursor" "path-key" "mimic-fn" "ansi-styles" "is-fullwidth-code-point" "eastasianwidth" "ansi-regex" "supports-color"; do
        if grep -q "\"node_modules/$dep\"" package-lock.json; then
            echo "  ✓ $dep found"
        else
            echo "  ✗ $dep still missing"
            MISSING_DEPS=$((MISSING_DEPS + 1))
        fi
    done
    
    echo ""
    if [ $MISSING_DEPS -eq 0 ]; then
        echo "✓ All dependencies are now present in package-lock.json"
    else
        echo "⚠ Some dependencies are still missing ($MISSING_DEPS)"
        echo "  This may be normal if they are not required by your current dependencies"
    fi
    
    # Check colorette version
    echo ""
    echo "Checking colorette version..."
    if grep -q '"colorette"' package-lock.json; then
        COLORETTE_VERSION=$(grep -A 1 '"node_modules/colorette"' package-lock.json | grep '"version"' | sed 's/.*"\(.*\)".*/\1/')
        echo "  Colorette version in lock file: $COLORETTE_VERSION"
        
        if [[ "$COLORETTE_VERSION" == "2.0.20" ]] || [[ "$COLORETTE_VERSION" > "2.0.19" ]]; then
            echo "  ✓ Colorette version is correct (>= 2.0.20)"
        else
            echo "  ℹ Colorette version: $COLORETTE_VERSION"
        fi
    fi
    
    echo ""
    echo "================================"
    echo "✓ Package lock file regeneration complete!"
    echo "================================"
    echo ""
    echo "Next steps:"
    echo "1. Test the installation: npm ci"
    echo "2. Run tests: npm test"
    echo "3. Commit the new package-lock.json file"
    echo ""
    
else
    echo "✗ ERROR: Failed to generate package-lock.json"
    exit 1
fi
