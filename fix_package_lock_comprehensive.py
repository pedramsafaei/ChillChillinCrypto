#!/usr/bin/env python3
"""
Fix package-lock.json by adding missing dependencies from package.json
"""

import json
import sys
from pathlib import Path

def load_json(filepath):
    """Load JSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)

def save_json(filepath, data):
    """Save JSON file with proper formatting"""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')

def fix_package_lock():
    """Fix package-lock.json to include missing dependencies"""
    
    # Load both files
    pkg_json = load_json('package.json')
    lock_json = load_json('package-lock.json')
    
    # Get dependencies from package.json
    pkg_deps = pkg_json.get('dependencies', {})
    pkg_dev_deps = pkg_json.get('devDependencies', {})
    
    # Get root package dependencies from lock file
    root_pkg = lock_json.get('packages', {}).get('', {})
    lock_deps = root_pkg.get('dependencies', {})
    lock_dev_deps = root_pkg.get('devDependencies', {})
    
    # Find missing dependencies
    missing_deps = {}
    missing_dev_deps = {}
    
    for dep, version in pkg_deps.items():
        if dep not in lock_deps:
            missing_deps[dep] = version
            print(f"Missing dependency: {dep}@{version}")
    
    for dep, version in pkg_dev_deps.items():
        if dep not in lock_dev_deps:
            missing_dev_deps[dep] = version
            print(f"Missing devDependency: {dep}@{version}")
    
    # Update the lock file's root package section
    if missing_deps:
        print(f"\nAdding {len(missing_deps)} missing dependencies to lock file root package...")
        for dep, version in missing_deps.items():
            lock_deps[dep] = version
        lock_json['packages']['']['dependencies'] = lock_deps
    
    if missing_dev_deps:
        print(f"Adding {len(missing_dev_deps)} missing devDependencies to lock file root package...")
        for dep, version in missing_dev_deps.items():
            lock_dev_deps[dep] = version
        lock_json['packages']['']['devDependencies'] = lock_dev_deps
    
    # Create backup
    backup_file = 'package-lock.json.backup-comprehensive-fix'
    print(f"\nCreating backup: {backup_file}")
    save_json(backup_file, load_json('package-lock.json'))
    
    # Save updated lock file
    print("Saving updated package-lock.json...")
    save_json('package-lock.json', lock_json)
    
    print("\n✓ package-lock.json has been updated!")
    print(f"✓ Added {len(missing_deps)} dependencies and {len(missing_dev_deps)} devDependencies")
    print("\nNote: This fix adds the missing entries to the root package section.")
    print("The full dependency tree with resolved versions will be generated when you run 'npm install'.")
    
    return True

if __name__ == '__main__':
    try:
        fix_package_lock()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
