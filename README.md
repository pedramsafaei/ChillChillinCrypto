# 🪙 ChillChillin Crypto

[![CI/CD Pipeline](https://github.com/pedramsafaei/ChillChillinCrypto/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/pedramsafaei/ChillChillinCrypto/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, feature-rich cryptocurrency tracking application built with React, Redux Toolkit, and modern web technologies. Track real-time cryptocurrency prices, manage your portfolio, set price alerts, and stay updated with the latest market trends.

## ✨ Features

### 🎯 Core Features
- **Real-time Price Tracking**: Live cryptocurrency prices with auto-refresh capability
- **Portfolio Management**: Track your crypto holdings with profit/loss calculations
- **Price Alerts**: Set custom price alerts with notifications
- **Favorites/Watchlist**: Quick access to your favorite cryptocurrencies
- **Advanced Charts**: Interactive charts with multiple timeframes (1H, 24H, 7D, 30D, 1Y)
- **Market Overview**: Global cryptocurrency market statistics and trends

### 🎨 User Interface
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Skeleton Loading**: Smooth loading states with skeleton screens
- **Error Boundaries**: Graceful error handling

### 📊 Advanced Features
- **Search & Filter**: Advanced search with multiple sorting options
- **Trending Coins**: See what's hot in the crypto market
- **Top Gainers/Losers**: Track the best and worst performers
- **Currency Conversion**: Support for multiple fiat currencies
- **Persistent Storage**: LocalStorage integration for preferences, favorites, and portfolio

### 🔧 Technical Features
- **Redux State Management**: Centralized state with Redux Toolkit
- **Code Splitting**: Lazy loading for optimal performance
- **PWA Ready**: Progressive Web App capabilities
- **API Service Layer**: Robust API handling with retry logic
- **Comprehensive Tests**: Unit, integration, and E2E tests
- **CI/CD Pipeline**: Automated testing and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or 18.x
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pedramsafaei/ChillChillinCrypto.git
cd ChillChillinCrypto
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
REACT_APP_CRYPTO_API_URL=https://api.coingecko.com/api/v3
REACT_APP_CRYPTO_API_KEY=your_api_key_here
```

4. **Start the development server**
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

Access the app at [http://localhost:3000](http://localhost:3000)

### Using Docker

```bash
# Build the image
docker build -t chillchillin-crypto .

# Run the container
docker run -d -p 3000:80 --name crypto-app chillchillin-crypto
```

## 📚 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md) - API integration guide
- [Architecture](./docs/ARCHITECTURE.md) - Application architecture and design decisions
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community guidelines

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run E2E tests
```bash
npm run cypress:open  # Interactive mode
npm run cypress:run   # Headless mode
```

## 📱 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Ant Design** - UI components
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Cypress** - E2E testing

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Nginx** - Web server

## 🌟 Key Features Explained

### Portfolio Management
Track your cryptocurrency investments with detailed statistics:
- Total investment value
- Current portfolio value
- Profit/Loss calculations
- Individual coin performance

### Price Alerts
Never miss important price movements:
- Set alerts for specific price targets
- Choose between "above" or "below" conditions
- Receive notifications when alerts trigger
- Manage multiple alerts simultaneously

### Advanced Charting
Visualize price trends with interactive charts:
- Multiple timeframes (1H to 1Y)
- Real-time price updates
- Smooth animations
- Responsive design

## 🎯 Roadmap

- [ ] TypeScript migration
- [ ] News integration
- [ ] Social sentiment analysis
- [ ] Advanced portfolio analytics
- [ ] Multi-language support
- [ ] Exchange integration
- [ ] DeFi protocol tracking

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- **Pedram Safaei** - [GitHub](https://github.com/pedramsafaei)

## 🙏 Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Ant Design](https://ant.design/) for beautiful UI components
- All contributors who help improve this project

## 📞 Support

For support, open an issue on GitHub.

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ by Pedram Safaei**
