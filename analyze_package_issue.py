#!/usr/bin/env python3
import json

# Load both files
with open('package.json', 'r') as f:
    pkg = json.load(f)

with open('package-lock.json', 'r') as f:
    lock = json.load(f)

print("=== PACKAGE.JSON Analysis ===")
print(f"\nDependencies ({len(pkg.get('dependencies', {}))} packages):")
for dep in sorted(pkg.get('dependencies', {}).keys()):
    print(f"  - {dep}: {pkg['dependencies'][dep]}")

print(f"\nDevDependencies ({len(pkg.get('devDependencies', {}))} packages):")
for dep in sorted(pkg.get('devDependencies', {}).keys()):
    print(f"  - {dep}: {pkg['devDependencies'][dep]}")

print("\n=== PACKAGE-LOCK.JSON Analysis ===")
root_pkg = lock.get('packages', {}).get('', {})
lock_deps = root_pkg.get('dependencies', {})
lock_dev_deps = root_pkg.get('devDependencies', {})

print(f"\nRoot package dependencies ({len(lock_deps)} packages):")
for dep in sorted(lock_deps.keys()):
    print(f"  - {dep}: {lock_deps[dep]}")

print(f"\nRoot package devDependencies ({len(lock_dev_deps)} packages):")
for dep in sorted(lock_dev_deps.keys()):
    print(f"  - {dep}: {lock_dev_deps[dep]}")

print("\n=== MISMATCH Analysis ===")

# Find missing deps
missing_deps = set(pkg.get('dependencies', {}).keys()) - set(lock_deps.keys())
missing_dev_deps = set(pkg.get('devDependencies', {}).keys()) - set(lock_dev_deps.keys())

if missing_deps:
    print(f"\nMissing {len(missing_deps)} dependencies in lock file:")
    for dep in sorted(missing_deps):
        print(f"  ✗ {dep}")

if missing_dev_deps:
    print(f"\nMissing {len(missing_dev_deps)} devDependencies in lock file:")
    for dep in sorted(missing_dev_deps):
        print(f"  ✗ {dep}")

# Check if deps are in node_modules section
print("\n=== Checking node_modules section ===")
node_modules = {k.replace('node_modules/', ''): v for k, v in lock.get('packages', {}).items() if k.startswith('node_modules/')}

print(f"\nTotal packages in node_modules: {len(node_modules)}")

missing_in_modules = []
for dep in missing_deps:
    if dep not in node_modules:
        missing_in_modules.append(dep)
        print(f"  ✗ {dep} NOT in node_modules section")
    else:
        print(f"  ✓ {dep} IS in node_modules section (but not in root deps)")

for dep in missing_dev_deps:
    if dep not in node_modules:
        missing_in_modules.append(dep)
        print(f"  ✗ {dep} NOT in node_modules section")
    else:
        print(f"  ✓ {dep} IS in node_modules section (but not in root devDeps)")

print(f"\n=== SUMMARY ===")
print(f"Total missing from root package section: {len(missing_deps) + len(missing_dev_deps)}")
print(f"Total completely missing: {len(missing_in_modules)}")

