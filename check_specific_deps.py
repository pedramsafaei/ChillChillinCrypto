#!/usr/bin/env python3
import json

# Packages that were reported as missing in the issue
required_packages = [
    'react-error-boundary',
    'recharts',
    'clsx',
    'react-is',
    'react-smooth',
    'recharts-scale',
    'tiny-invariant',
    'victory-vendor',
    'fast-equals',
    'react-transition-group',
    'dom-helpers',
    'decimal.js-light',
    'd3-array',
    'd3-ease',
    'd3-interpolate',
    'd3-scale',
    'd3-shape',
    'd3-time',
    'd3-timer',
    'd3-color',
    'd3-format',
    'd3-time-format',
    'd3-path',
    'internmap',
]

with open('package-lock.json', 'r') as f:
    lock = json.load(f)

node_modules = {k.replace('node_modules/', ''): v for k, v in lock.get('packages', {}).items() if k.startswith('node_modules/')}

print("Checking for packages mentioned in the CI error:\n")

missing = []
found = []

for pkg in required_packages:
    if pkg in node_modules:
        version = node_modules[pkg].get('version', 'unknown')
        found.append(pkg)
        print(f"✓ {pkg} @ {version}")
    else:
        missing.append(pkg)
        print(f"✗ {pkg} - MISSING")

print(f"\n=== SUMMARY ===")
print(f"Found: {len(found)}/{len(required_packages)}")
print(f"Missing: {len(missing)}/{len(required_packages)}")

if missing:
    print(f"\nMissing packages:")
    for pkg in missing:
        print(f"  - {pkg}")

