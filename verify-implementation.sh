#!/bin/bash

# Verification script for ChillChillin Crypto implementation

echo "🔍 Verifying ChillChillin Crypto Implementation"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counter
total=0
found=0

check_file() {
    total=$((total + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        found=$((found + 1))
    else
        echo -e "${RED}✗${NC} $1 (missing)"
    fi
}

check_dir() {
    total=$((total + 1))
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        found=$((found + 1))
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
    fi
}

echo "📦 Core Files:"
check_file "package.json"
check_file "README.md"
check_file ".env.example"
check_file ".gitignore"

echo ""
echo "🏗️  Configuration Files:"
check_file ".eslintrc.js"
check_file ".prettierrc"
check_file "Dockerfile"
check_file "docker-compose.yml"
check_file "nginx.conf"
check_file "cypress.config.js"

echo ""
echo "📚 Documentation:"
check_file "CONTRIBUTING.md"
check_file "CODE_OF_CONDUCT.md"
check_file "IMPLEMENTATION_SUMMARY.md"
check_file "docs/API_DOCUMENTATION.md"
check_file "docs/ARCHITECTURE.md"

echo ""
echo "🔧 Scripts:"
check_file "setup.sh"

echo ""
echo "🏪 Redux Store:"
check_file "src/store/store.js"
check_file "src/store/slices/cryptoSlice.js"
check_file "src/store/slices/portfolioSlice.js"
check_file "src/store/slices/favoritesSlice.js"
check_file "src/store/slices/preferencesSlice.js"
check_file "src/store/slices/alertsSlice.js"

echo ""
echo "🌐 API Services:"
check_file "src/services/axiosConfig.js"
check_file "src/services/cryptoAPI.js"

echo ""
echo "🧩 Components:"
check_file "src/components/Navbar.jsx"
check_file "src/components/CryptoCard.jsx"
check_file "src/components/CryptoChart.jsx"
check_file "src/components/ErrorBoundary.jsx"
check_file "src/components/LoadingSkeleton.jsx"
check_file "src/components/ThemeToggle.jsx"
check_file "src/components/index.js"

echo ""
echo "📄 Pages:"
check_file "src/pages/Home.jsx"
check_file "src/pages/Cryptocurrencies.jsx"
check_file "src/pages/CryptoDetails.jsx"
check_file "src/pages/Portfolio.jsx"
check_file "src/pages/Favorites.jsx"
check_file "src/pages/Alerts.jsx"
check_file "src/pages/Settings.jsx"

echo ""
echo "🪝 Hooks & Utils:"
check_file "src/hooks/useCryptoData.js"
check_file "src/hooks/useDebounce.js"
check_file "src/utils/formatters.js"
check_file "src/utils/validators.js"

echo ""
echo "🧪 Tests:"
check_file "src/setupTests.js"
check_file "src/__tests__/components/CryptoCard.test.js"
check_file "src/__tests__/store/cryptoSlice.test.js"
check_file "src/__tests__/store/portfolioSlice.test.js"
check_file "cypress/e2e/home.cy.js"
check_file "cypress/e2e/portfolio.cy.js"
check_file "cypress/support/e2e.js"
check_file "cypress/support/commands.js"

echo ""
echo "📝 Examples:"
check_file "examples/USAGE_EXAMPLES.md"

echo ""
echo "⚙️  CI/CD:"
check_file ".github/workflows/ci.yml"

echo ""
echo "🎨 Styles:"
check_file "src/App.css"
check_file "src/index.css"

echo ""
echo "🚀 Entry Points:"
check_file "src/App.js"
check_file "src/index.js"

echo ""
echo "=============================================="
echo -e "Result: ${GREEN}$found${NC}/$total files/directories verified"
echo ""

if [ $found -eq $total ]; then
    echo -e "${GREEN}✅ All files are present!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run './setup.sh' to install dependencies"
    echo "2. Configure .env with your API keys"
    echo "3. Run 'npm start' to launch the app"
    exit 0
else
    missing=$((total - found))
    echo -e "${YELLOW}⚠️  $missing file(s) missing${NC}"
    exit 1
fi
