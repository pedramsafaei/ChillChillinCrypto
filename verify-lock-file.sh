#!/bin/bash

# Script to verify package-lock.json is correctly regenerated
# This checks for the previously missing dependencies and version issues

set -e

echo "========================================="
echo "Package Lock File Verification"
echo "========================================="
echo ""

# Check if package-lock.json exists
if [ ! -f "package-lock.json" ]; then
    echo "❌ ERROR: package-lock.json does not exist!"
    echo ""
    echo "Please run: ./regenerate-lockfile.sh"
    exit 1
fi

echo "✅ package-lock.json exists"
echo ""

# Check file size (should be substantial)
FILE_SIZE=$(wc -c < "package-lock.json")
if [ "$FILE_SIZE" -lt 10000 ]; then
    echo "⚠️  WARNING: package-lock.json seems too small ($FILE_SIZE bytes)"
    echo "   Expected size: > 500KB"
else
    echo "✅ File size: $FILE_SIZE bytes"
fi

echo ""
echo "Checking for previously missing dependencies..."
echo "-------------------------------------------"

MISSING_COUNT=0
FOUND_COUNT=0

# List of previously missing dependencies
DEPENDENCIES=(
    "color-convert"
    "color-name"
    "get-stream"
    "human-signals"
    "pump"
    "end-of-stream"
    "has-flag"
    "is-stream"
    "npm-run-path"
    "onetime"
    "strip-final-newline"
    "cli-truncate"
    "eventemitter3"
    "log-update"
    "wrap-ansi"
    "slice-ansi"
    "string-width"
    "ansi-escapes"
    "cli-cursor"
    "strip-ansi"
    "type-fest"
    "restore-cursor"
    "path-key"
    "mimic-fn"
    "ansi-styles"
    "is-fullwidth-code-point"
    "eastasianwidth"
    "ansi-regex"
    "supports-color"
)

for dep in "${DEPENDENCIES[@]}"; do
    if grep -q "\"node_modules/$dep\"" package-lock.json; then
        echo "  ✅ $dep"
        FOUND_COUNT=$((FOUND_COUNT + 1))
    else
        echo "  ❌ $dep - MISSING"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    fi
done

echo ""
echo "Summary: $FOUND_COUNT found, $MISSING_COUNT missing"

# Check colorette version
echo ""
echo "Checking colorette version..."
echo "-------------------------------------------"

if grep -q '"node_modules/colorette"' package-lock.json; then
    # Extract version number
    COLORETTE_VERSION=$(grep -A 2 '"node_modules/colorette"' package-lock.json | grep '"version"' | head -1 | sed 's/.*"\([0-9.]*\)".*/\1/')
    echo "  Colorette version: $COLORETTE_VERSION"
    
    # Compare versions (simple string comparison works for x.y.z format)
    if [ "$COLORETTE_VERSION" = "2.0.20" ] || [ "$COLORETTE_VERSION" \> "2.0.20" ]; then
        echo "  ✅ Version is 2.0.20 or higher (required)"
    elif [ "$COLORETTE_VERSION" = "2.0.19" ]; then
        echo "  ❌ Version is still 2.0.19 (needs to be 2.0.20)"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    else
        echo "  ℹ️  Version: $COLORETTE_VERSION"
    fi
else
    echo "  ⚠️  colorette not found in lock file"
    echo "     (This may be normal if not required by current dependencies)"
fi

# Check lockfile version
echo ""
echo "Checking lock file format..."
echo "-------------------------------------------"

LOCKFILE_VERSION=$(grep -m 1 '"lockfileVersion"' package-lock.json | sed 's/.*: \([0-9]*\).*/\1/')
echo "  Lock file version: $LOCKFILE_VERSION"

if [ "$LOCKFILE_VERSION" = "3" ] || [ "$LOCKFILE_VERSION" = "2" ]; then
    echo "  ✅ Using modern lockfile format"
else
    echo "  ⚠️  Unexpected lockfile version"
fi

# Count total packages
echo ""
echo "Package statistics..."
echo "-------------------------------------------"

TOTAL_PACKAGES=$(grep -c '"node_modules/' package-lock.json || echo "0")
echo "  Total packages in lock file: $TOTAL_PACKAGES"

if [ "$TOTAL_PACKAGES" -lt 1000 ]; then
    echo "  ⚠️  Package count seems low (expected ~1500+)"
else
    echo "  ✅ Package count looks reasonable"
fi

# Final verdict
echo ""
echo "========================================="
if [ "$MISSING_COUNT" -eq 0 ] && [ "$TOTAL_PACKAGES" -gt 1000 ]; then
    echo "✅ VERIFICATION PASSED"
    echo "========================================="
    echo ""
    echo "The package-lock.json file appears to be correctly regenerated."
    echo ""
    echo "Next steps:"
    echo "  1. Test installation: npm ci"
    echo "  2. Run tests: npm test"
    echo "  3. Run linter: npm run lint"
    echo "  4. Build application: npm run build"
    echo "  5. Commit the new package-lock.json"
    echo ""
    exit 0
else
    echo "⚠️  VERIFICATION INCOMPLETE"
    echo "========================================="
    echo ""
    echo "Issues found: $MISSING_COUNT"
    echo ""
    echo "Recommendations:"
    if [ "$MISSING_COUNT" -gt 0 ]; then
        echo "  - Some dependencies are still missing"
        echo "  - Try running: npm install --force"
        echo "  - Or: rm -rf node_modules && npm install"
    fi
    if [ "$TOTAL_PACKAGES" -lt 1000 ]; then
        echo "  - Package count is low"
        echo "  - Verify package.json is correct"
        echo "  - Check npm version: npm --version"
    fi
    echo ""
    echo "If issues persist, see PACKAGE_LOCK_FIX_README.md for troubleshooting"
    echo ""
    exit 1
fi
