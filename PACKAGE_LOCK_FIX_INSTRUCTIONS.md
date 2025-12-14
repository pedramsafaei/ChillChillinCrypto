# Package Lock File Fix Instructions

## Problem Summary

The CI/CD pipeline is failing due to a corrupted/incomplete `package-lock.json` file. The lock file was missing:

1. **23 transitive dependency packages** in the `node_modules/*` section
2. **Full dependency tree** with resolved versions and integrity hashes

### Missing Packages
The following packages declared in `package.json` were missing their node_modules entries:
- `react-error-boundary@4.1.2` (and its dependencies)
- `recharts@2.15.4` (and its dependencies: clsx, react-smooth, recharts-scale, decimal.js-light, d3-*, etc.)
- Various d3-* packages
- And other transitive dependencies

## Solution

The corrupted `package-lock.json` has been **removed** and needs to be regenerated using `npm install`.

### Option 1: Local Fix (Recommended if you have npm access)

```bash
# Run the fix script
./fix-npm-ci.sh
```

Or manually:

```bash
# 1. Ensure Node.js 18.x is installed
node --version  # Should be v18.x

# 2. Clean install
rm -rf node_modules
npm cache clean --force

# 3. Regenerate lock file
npm install

# 4. Verify the fix
npm ci
npm test

# 5. Commit the changes
git add package-lock.json
git commit -m "fix: regenerate package-lock.json with all dependencies"
git push
```

### Option 2: GitHub Actions Workflow (Recommended for INTEGRATIONS_ONLY mode)

A GitHub Actions workflow is available to automatically fix this issue:

```bash
# The workflow will auto-trigger when changes are pushed
# Just commit and push your changes, and the workflow will regenerate the lock file
git add -A
git commit -m "fix: remove corrupted package-lock.json"
git push
```

The workflow (`.github/workflows/regenerate-lockfile.yml`) will:
1. Set up Node.js 18.x environment
2. Remove old lock file and node_modules
3. Run `npm install` to regenerate
4. Verify with `npm ci`
5. Run test suite
6. Auto-commit and push the regenerated lock file

### Option 3: Docker (If you have Docker with internet access)

```bash
docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
  rm -rf node_modules package-lock.json &&
  npm cache clean --force &&
  npm install &&
  npm ci &&
  npm test
"

# Then commit the regenerated package-lock.json
git add package-lock.json
git commit -m "fix: regenerate package-lock.json with all dependencies"
git push
```

## What Was Done

1. ✅ Removed the corrupted `package-lock.json` file
2. ✅ Created `fix-npm-ci.sh` script for easy regeneration
3. ✅ Verified that `package.json` is correct (all 32 dependencies + 13 devDependencies)
4. ✅ Confirmed GitHub Actions workflow is ready (`.github/workflows/regenerate-lockfile.yml`)

## What Needs To Happen Next

1. **Regenerate package-lock.json** using one of the options above
2. **Verify** the fix with `npm ci` and `npm test`
3. **Commit and push** the new lock file to the repository

## Why This Happened

The lock file became corrupted/incomplete, likely due to:
- Manual editing of package-lock.json
- Adding dependencies to package.json without running `npm install`
- Incomplete git merge resolution
- Lock file truncation or corruption

## Technical Details

### Before Fix
- ❌ Lock file had 1598 packages in node_modules section
- ❌ Missing 23 specific packages needed by recharts and react-error-boundary
- ❌ `npm ci` would fail with "missing dependencies" error
- ❌ CI/CD pipeline failing

### After Fix (Expected)
- ✅ Lock file will have all required packages (~1600-1700 packages)
- ✅ All transitive dependencies properly resolved
- ✅ Integrity hashes calculated for all packages
- ✅ `npm ci` will succeed
- ✅ CI/CD pipeline will pass

## Verification

Once the lock file is regenerated, verify with:

```bash
# Should complete without errors
npm ci

# Should show all tests passing
npm test

# Should show the new lock file
git status
```

## Support

If you encounter issues:
1. Ensure Node.js 18.x is installed: `node --version`
2. Ensure npm is installed: `npm --version`
3. Clear npm cache: `npm cache clean --force`
4. Remove node_modules: `rm -rf node_modules`
5. Try again: `npm install`

For Docker-related issues in INTEGRATIONS_ONLY mode:
- The Dockerfile will work once package-lock.json is regenerated
- GitHub Actions workflow is the recommended solution
