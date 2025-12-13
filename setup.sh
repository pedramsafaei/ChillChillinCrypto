#!/bin/bash

# ChillChillin Crypto Setup Script
# This script sets up the development environment

set -e

echo "🪙 ChillChillin Crypto Setup Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 16.x or 18.x from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm -v) detected${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update .env with your API keys${NC}"
fi

# Initialize Husky
echo "🐕 Setting up Husky..."
npm run prepare 2>/dev/null || echo "Husky already initialized"

# Create .husky directory if it doesn't exist
mkdir -p .husky

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF

chmod +x .husky/pre-commit

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys"
echo "2. Run 'npm start' to start the development server"
echo "3. Run 'npm test' to run tests"
echo "4. Run 'npm run build' to create production build"
echo ""
echo "For Docker deployment:"
echo "• Run 'docker-compose up -d'"
echo ""
echo "Happy coding! 🚀"
