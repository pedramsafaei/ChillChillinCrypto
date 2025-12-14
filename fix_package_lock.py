#!/usr/bin/env python3
"""
Script to manually fix specific known issues in package-lock.json.
This is a workaround for environments where npm/node is not available.

Fixes:
1. Updates colorette from 2.0.19 to 2.0.20
2. Documents missing dependencies issue

Note: This is a partial fix. Full regeneration with 'npm install' is recommended.
"""

import json
import sys
from pathlib import Path

def fix_package_lock():
    lock_file = Path('package-lock.json')
    
    if not lock_file.exists():
        print("ERROR: package-lock.json not found!")
        return False
    
    print("Reading package-lock.json...")
    with open(lock_file, 'r') as f:
        lock_data = json.load(f)
    
    print(f"Lock file version: {lock_data.get('lockfileVersion')}")
    
    changes_made = False
    
    # Fix colorette version in packages
    if 'packages' in lock_data:
        for pkg_path, pkg_data in lock_data['packages'].items():
            if 'colorette' in pkg_path and 'version' in pkg_data:
                old_version = pkg_data['version']
                if old_version == '2.0.19':
                    print(f"Found colorette@{old_version} at {pkg_path}")
                    pkg_data['version'] = '2.0.20'
                    # Update resolved URL if it contains version
                    if 'resolved' in pkg_data:
                        pkg_data['resolved'] = pkg_data['resolved'].replace('2.0.19', '2.0.20')
                    # Note: integrity hash would need to be updated with actual value
                    # This is why npm install is the proper solution
                    print(f"Updated to colorette@2.0.20")
                    print("WARNING: Integrity hash not updated - full npm install recommended")
                    changes_made = True
    
    # Fix colorette in legacy dependencies format (lockfileVersion < 3)
    if 'dependencies' in lock_data and 'colorette' in lock_data['dependencies']:
        old_version = lock_data['dependencies']['colorette'].get('version')
        if old_version == '2.0.19':
            print(f"Found colorette@{old_version} in dependencies")
            lock_data['dependencies']['colorette']['version'] = '2.0.20'
            if 'resolved' in lock_data['dependencies']['colorette']:
                resolved = lock_data['dependencies']['colorette']['resolved']
                lock_data['dependencies']['colorette']['resolved'] = resolved.replace('2.0.19', '2.0.20')
            print(f"Updated to colorette@2.0.20")
            print("WARNING: Integrity hash not updated - full npm install recommended")
            changes_made = True
    
    if changes_made:
        # Backup original
        backup_file = Path('package-lock.json.backup-python-fix')
        print(f"Creating backup at {backup_file}...")
        with open(backup_file, 'w') as f:
            json.dump(lock_data, f, indent=2)
        
        # Write updated version
        print("Writing updated package-lock.json...")
        with open(lock_file, 'w') as f:
            json.dump(lock_data, f, indent=2)
        
        print("\n✓ package-lock.json has been partially updated")
        print("\nIMPORTANT:")
        print("  - This is a PARTIAL fix for colorette version only")
        print("  - Integrity hashes were NOT updated (would cause npm ci to fail)")
        print("  - Missing dependencies still need to be added")
        print("  - Full 'npm install' regeneration is REQUIRED")
        print("\nRecommendation:")
        print("  - Use GitHub Actions workflow (push to fix/package-lock branch)")
        print("  - Or run 'npm install' in an environment with Node.js")
        return True
    else:
        print("\nNo changes needed or changes could not be applied")
        return False

if __name__ == '__main__':
    success = fix_package_lock()
    sys.exit(0 if success else 1)
