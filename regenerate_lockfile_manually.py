#!/usr/bin/env python3
"""
Manual package-lock.json regeneration script.
This adds missing dependencies that are in package.json but not in package-lock.json.

WARNING: This is a workaround for environments without npm.
The proper solution is to run: rm package-lock.json && npm install

This script adds entries for missing packages, but integrity hashes are placeholders.
After running this, you MUST run 'npm install' to get correct hashes.
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# Missing top-level dependencies with their versions from package.json
MISSING_PACKAGES = {
    "cypress": {
        "version": "12.7.0",
        "dev": True,
        "description": "E2E testing framework"
    },
    "eslint-config-prettier": {
        "version": "8.8.0",
        "dev": True,
        "description": "ESLint config for Prettier"
    },
    "eslint-plugin-prettier": {
        "version": "4.2.1",
        "dev": True,
        "description": "ESLint plugin for Prettier"
    },
    "husky": {
        "version": "8.0.3",
        "dev": True,
        "description": "Git hooks"
    },
    "lint-staged": {
        "version": "13.2.0",
        "dev": True,
        "description": "Lint staged files"
    },
    "prettier": {
        "version": "2.8.4",
        "dev": True,
        "description": "Code formatter"
    }
}

# Known transitive dependencies that should be present
# These are simplified entries - real entries would have full dep trees
TRANSITIVE_DEPS = {
    "pump": {
        "version": "3.0.3",
        "resolved": "https://registry.npmjs.org/pump/-/pump-3.0.3.tgz",
        "dependencies": {
            "end-of-stream": "^1.1.0",
            "once": "^1.3.1"
        }
    },
    "end-of-stream": {
        "version": "1.4.5",
        "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.5.tgz",
        "dependencies": {
            "once": "^1.4.0"
        }
    },
    "cli-truncate": {
        "version": "3.1.0",
        "resolved": "https://registry.npmjs.org/cli-truncate/-/cli-truncate-3.1.0.tgz",
        "dependencies": {
            "slice-ansi": "^5.0.0",
            "string-width": "^5.0.0"
        }
    },
    "log-update": {
        "version": "5.0.1",
        "resolved": "https://registry.npmjs.org/log-update/-/log-update-5.0.1.tgz",
        "dependencies": {
            "ansi-escapes": "^5.0.0",
            "cli-cursor": "^4.0.0",
            "slice-ansi": "^5.0.0",
            "wrap-ansi": "^8.0.1"
        }
    },
    "slice-ansi": {
        "version": "5.0.0",
        "resolved": "https://registry.npmjs.org/slice-ansi/-/slice-ansi-5.0.0.tgz",
        "dependencies": {
            "ansi-styles": "^6.0.0",
            "is-fullwidth-code-point": "^4.0.0"
        }
    },
    "cli-cursor": {
        "version": "4.0.0",
        "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-4.0.0.tgz",
        "dependencies": {
            "restore-cursor": "^4.0.0"
        }
    },
    "restore-cursor": {
        "version": "4.0.0",
        "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-4.0.0.tgz",
        "dependencies": {
            "onetime": "^5.1.0",
            "signal-exit": "^3.0.2"
        }
    },
    "eastasianwidth": {
        "version": "0.2.0",
        "resolved": "https://registry.npmjs.org/eastasianwidth/-/eastasianwidth-0.2.0.tgz",
        "dependencies": {}
    }
}

def create_package_entry(name, version, dev=False, resolved=None, dependencies=None):
    """Create a package entry for lockfile v3 format."""
    entry = {
        "version": version,
        "resolved": resolved or f"https://registry.npmjs.org/{name}/-/{name}-{version}.tgz",
        "integrity": "sha512-PLACEHOLDER_HASH_" + "=" * 64,  # Placeholder - npm install will fix
    }
    
    if dev:
        entry["dev"] = True
    
    if dependencies:
        entry["dependencies"] = dependencies
    
    # Add engines for certain packages
    if name in ["cypress"]:
        entry["engines"] = {"node": "^14.0.0 || ^16.0.0 || >=18.0.0"}
    
    # Add bin for CLI tools
    if name in ["prettier", "cypress"]:
        entry["bin"] = {name: f"bin/{name}.js"}
    
    return entry

def fix_package_lock():
    """Add missing dependencies to package-lock.json."""
    
    lock_file = Path('package-lock.json')
    
    if not lock_file.exists():
        print("❌ ERROR: package-lock.json not found!")
        print("   Cannot add missing dependencies to a non-existent file.")
        return False
    
    # Backup
    backup_file = Path(f'package-lock.json.backup-manual-fix-{datetime.now().strftime("%Y%m%d_%H%M%S")}')
    print(f"📦 Creating backup: {backup_file}")
    with open(lock_file, 'r') as f:
        lock_data = json.load(f)
    
    with open(backup_file, 'w') as f:
        json.dump(lock_data, f, indent=2)
    
    print(f"✓ Backup created")
    print()
    
    # Verify format
    lockfile_version = lock_data.get('lockfileVersion')
    print(f"📋 Lock file version: {lockfile_version}")
    
    if lockfile_version != 3:
        print(f"⚠️  WARNING: Expected lockfileVersion 3, got {lockfile_version}")
        print("   This script is designed for lockfile v3 format")
    
    print()
    print("=" * 60)
    print("ADDING MISSING TOP-LEVEL PACKAGES")
    print("=" * 60)
    
    packages = lock_data.get('packages', {})
    added_count = 0
    
    # Add missing top-level packages
    for pkg_name, pkg_info in MISSING_PACKAGES.items():
        pkg_key = f"node_modules/{pkg_name}"
        
        if pkg_key in packages:
            print(f"  ⊙ {pkg_name}@{pkg_info['version']} - already present")
        else:
            print(f"  + {pkg_name}@{pkg_info['version']} - ADDING")
            packages[pkg_key] = create_package_entry(
                pkg_name,
                pkg_info['version'],
                dev=pkg_info.get('dev', False)
            )
            added_count += 1
            
            # Also add to root dependencies or devDependencies
            if pkg_info.get('dev'):
                if 'devDependencies' not in packages.get('', {}):
                    packages['']['devDependencies'] = {}
                packages['']['devDependencies'][pkg_name] = f"^{pkg_info['version']}"
    
    print()
    print("=" * 60)
    print("ADDING MISSING TRANSITIVE DEPENDENCIES")
    print("=" * 60)
    
    # Add transitive dependencies
    for pkg_name, pkg_info in TRANSITIVE_DEPS.items():
        pkg_key = f"node_modules/{pkg_name}"
        
        if pkg_key in packages:
            print(f"  ⊙ {pkg_name}@{pkg_info['version']} - already present")
        else:
            print(f"  + {pkg_name}@{pkg_info['version']} - ADDING")
            packages[pkg_key] = create_package_entry(
                pkg_name,
                pkg_info['version'],
                resolved=pkg_info.get('resolved'),
                dependencies=pkg_info.get('dependencies')
            )
            added_count += 1
    
    print()
    print("=" * 60)
    print("SAVING UPDATED LOCK FILE")
    print("=" * 60)
    
    if added_count > 0:
        lock_data['packages'] = packages
        
        with open(lock_file, 'w') as f:
            json.dump(lock_data, f, indent=2)
        
        print(f"✓ Added {added_count} package entries")
        print(f"✓ Wrote updated package-lock.json")
        print()
        print("=" * 60)
        print("⚠️  IMPORTANT WARNINGS")
        print("=" * 60)
        print()
        print("1. PLACEHOLDER INTEGRITY HASHES")
        print("   All added packages have placeholder SHA-512 hashes.")
        print("   npm ci will FAIL with these placeholders.")
        print()
        print("2. INCOMPLETE DEPENDENCY TREES")
        print("   Complex packages like Cypress have hundreds of dependencies.")
        print("   Only direct dependencies were added, not full trees.")
        print()
        print("3. PROPER FIX REQUIRED")
        print("   You MUST run one of these to complete the fix:")
        print("   • npm install --package-lock-only")
        print("   • rm package-lock.json && npm install")
        print("   • Use GitHub Actions workflow")
        print()
        print("=" * 60)
        print("NEXT STEPS")
        print("=" * 60)
        print()
        print("This script has prepared package-lock.json with entries for")
        print("missing packages, but with placeholder values.")
        print()
        print("To complete the fix:")
        print()
        print("  Option 1 (Recommended): Use npm")
        print("  $ npm install --package-lock-only")
        print()
        print("  Option 2: Regenerate from scratch")
        print("  $ rm package-lock.json && npm install")
        print()
        print("  Option 3: GitHub Actions")
        print("  $ git push origin fix/package-lock")
        print()
        print("After that, verify with:")
        print("  $ ./verify-lock-file.sh")
        print("  $ npm ci")
        print()
        return True
    else:
        print("ℹ️  No packages were added (all already present)")
        return False

if __name__ == '__main__':
    print()
    print("=" * 60)
    print("MANUAL PACKAGE-LOCK.JSON FIX")
    print("=" * 60)
    print()
    print("This script adds missing package entries to package-lock.json")
    print("for packages that are in package.json but missing from the lock.")
    print()
    print("⚠️  This is a PARTIAL fix with placeholder integrity hashes.")
    print("   npm access is required to complete the fix properly.")
    print()
    
    try:
        success = fix_package_lock()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
