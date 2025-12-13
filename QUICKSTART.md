# 🚀 Quick Start Guide

Get ChillChillin Crypto up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 16.x or 18.x installed ([Download](https://nodejs.org/))
- ✅ npm or yarn package manager
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

Check your versions:
```bash
node --version  # Should be v16.x or v18.x
npm --version   # Should be 8.x or higher
```

## Installation Steps

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pedramsafaei/ChillChillinCrypto.git
cd ChillChillinCrypto
```

### 2️⃣ Automated Setup (Recommended)

```bash
./setup.sh
```

This script will:
- Install all dependencies
- Create .env file from template
- Set up Husky pre-commit hooks
- Prepare your development environment

### 3️⃣ Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Initialize Husky
npm run prepare
```

### 4️⃣ Configure API Keys

Edit `.env` and add your CoinGecko API key:

```env
REACT_APP_CRYPTO_API_URL=https://api.coingecko.com/api/v3
REACT_APP_CRYPTO_API_KEY=your_api_key_here
```

**Get a free API key**: https://www.coingecko.com/en/api/pricing

> 💡 **Tip**: The app will work without an API key but with rate limits.

### 5️⃣ Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Quick Start

Prefer Docker? Run this single command:

```bash
docker-compose up -d
```

Access at [http://localhost:3000](http://localhost:3000)

To stop:
```bash
docker-compose down
```

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Create production build |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run cypress:open` | Open Cypress E2E tests |

## 🎯 First Steps After Installation

### 1. Explore the Home Page
- View global cryptocurrency market statistics
- See trending cryptocurrencies
- Check top 10 coins by market cap

### 2. Browse Cryptocurrencies
- Navigate to "Cryptocurrencies" page
- Use search to find specific coins
- Sort by price, market cap, or 24h change

### 3. Create Your Portfolio
- Go to "Portfolio" page
- Click "Add Holdings"
- Enter your cryptocurrency holdings

### 4. Set Price Alerts
- Navigate to "Alerts" page
- Click "Create Alert"
- Set target price and condition

### 5. Customize Settings
- Go to "Settings" page
- Choose your theme (Dark/Light)
- Select preferred currency
- Configure auto-refresh

## 🎨 Theme Toggle

Toggle between dark and light themes using the switch in the navigation bar.

## 📱 Responsive Design

The app works perfectly on:
- 📱 Mobile phones
- 📲 Tablets
- 💻 Desktop computers

## 🔍 Features to Try

### Portfolio Management
1. Add your crypto holdings
2. Track real-time value
3. See profit/loss calculations
4. Edit or remove holdings

### Favorites/Watchlist
1. Click the star icon on any cryptocurrency
2. View all favorites in "Favorites" page
3. Quick access to your watched coins

### Price Charts
1. View any cryptocurrency details
2. Switch between timeframes (1H, 24H, 7D, 30D, 1Y)
3. See real-time price updates

### Search & Filter
1. Use the search bar to find coins
2. Sort by various metrics
3. Filter your results

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm start
```

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues
```bash
# Rebuild Docker image
docker-compose build --no-cache

# View logs
docker-compose logs -f
```

### API Rate Limiting
If you see rate limit errors:
1. Get a free API key from CoinGecko
2. Add it to your `.env` file
3. Restart the development server

## 📚 Next Steps

After getting started:

1. **Read the Documentation**
   - [README.md](./README.md) - Full project overview
   - [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) - API guide
   - [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical details

2. **Explore Examples**
   - [USAGE_EXAMPLES.md](./examples/USAGE_EXAMPLES.md) - Code examples

3. **Contribute**
   - [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
   - [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - Community guidelines

## 💡 Tips for Development

1. **Use the Browser DevTools**
   - Redux DevTools Extension for state inspection
   - React Developer Tools for component debugging

2. **Hot Reload**
   - Changes to code automatically reload the browser
   - CSS changes apply instantly

3. **Testing**
   - Write tests as you develop features
   - Maintain 80%+ code coverage

4. **Code Quality**
   - Pre-commit hooks run automatically
   - Fix linting issues before committing

## 🆘 Getting Help

If you encounter issues:

1. Check [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/pedramsafaei/ChillChillinCrypto/issues)
3. Open a new issue with details
4. Read the [documentation](./docs)

## ⚡ Performance Tips

- Keep browser DevTools open to monitor performance
- Use the Lighthouse tab for audits
- Check Network tab for API calls
- Monitor bundle size with `npm run build`

## 🎉 You're Ready!

Congratulations! You now have ChillChillin Crypto running locally.

Start exploring cryptocurrency data, building your portfolio, and tracking prices!

---

**Happy Coding!** 💻✨

For more details, see the [full README](./README.md).
