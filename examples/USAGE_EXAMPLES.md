# Usage Examples

## Basic Usage

### 1. Fetching Cryptocurrency Data

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoList } from './store/slices/cryptoSlice';

function CryptoList() {
  const dispatch = useDispatch();
  const { cryptoList, loading, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    dispatch(fetchCryptoList({ page: 1, limit: 50, currency: 'usd' }));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {cryptoList.map((crypto) => (
        <div key={crypto.id}>{crypto.name}</div>
      ))}
    </div>
  );
}
```

### 2. Adding to Portfolio

```javascript
import { useDispatch } from 'react-redux';
import { addHolding } from './store/slices/portfolioSlice';

function AddToPortfolio() {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(
      addHolding({
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'btc',
        amount: 1,
        purchasePrice: 50000,
        currentPrice: 55000,
        purchaseDate: new Date().toISOString(),
      })
    );
  };

  return <button onClick={handleAdd}>Add to Portfolio</button>;
}
```

### 3. Managing Favorites

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from './store/slices/favoritesSlice';

function FavoriteButton({ coinId, coinName, coinSymbol }) {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(coinId));

  const handleToggle = () => {
    dispatch(toggleFavorite({ coinId, coinName, coinSymbol }));
  };

  return (
    <button onClick={handleToggle}>
      {isFavorite ? '★' : '☆'}
    </button>
  );
}
```

### 4. Setting Price Alerts

```javascript
import { useDispatch } from 'react-redux';
import { addAlert } from './store/slices/alertsSlice';

function CreateAlert() {
  const dispatch = useDispatch();

  const handleCreateAlert = () => {
    dispatch(
      addAlert({
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'btc',
        targetPrice: 60000,
        condition: 'above',
        currentPrice: 50000,
        note: 'Bitcoin reaches $60k',
      })
    );
  };

  return <button onClick={handleCreateAlert}>Create Alert</button>;
}
```

### 5. Theme Toggle

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './store/slices/preferencesSlice';

function ThemeToggleButton() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.preferences);

  return (
    <button onClick={() => dispatch(toggleTheme())}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

## Advanced Usage

### Custom Hook for Crypto Data

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoDetails } from './store/slices/cryptoSlice';

export const useCryptoDetails = (coinId) => {
  const dispatch = useDispatch();
  const { cryptoDetails, loading, error } = useSelector((state) => state.crypto);
  const crypto = cryptoDetails[coinId];

  useEffect(() => {
    if (coinId && !crypto) {
      dispatch(fetchCryptoDetails(coinId));
    }
  }, [coinId, crypto, dispatch]);

  return { crypto, loading, error };
};

// Usage
function CryptoDetailsPage({ coinId }) {
  const { crypto, loading, error } = useCryptoDetails(coinId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!crypto) return <div>No data</div>;

  return (
    <div>
      <h1>{crypto.name}</h1>
      <p>Price: ${crypto.market_data?.current_price?.usd}</p>
    </div>
  );
}
```

### Debounced Search

```javascript
import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { searchCryptos } from './store/slices/cryptoSlice';
import debounce from 'lodash/debounce';

function SearchBar() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (value.length > 2) {
          dispatch(searchCryptos(value));
        }
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search cryptocurrencies..."
    />
  );
}
```

### Real-time Price Updates

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoList } from './store/slices/cryptoSlice';

function RealTimePrices() {
  const dispatch = useDispatch();
  const { autoRefresh, refreshInterval } = useSelector((state) => state.preferences);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      dispatch(fetchCryptoList({ page: 1, limit: 50 }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, dispatch]);

  // Component rendering...
}
```

### Portfolio Value Calculator

```javascript
import { useSelector } from 'react-redux';

function PortfolioSummary() {
  const { holdings, totalValue, totalInvestment, totalProfitLoss } = useSelector(
    (state) => state.portfolio
  );

  const profitLossPercentage = totalInvestment > 0
    ? ((totalProfitLoss / totalInvestment) * 100).toFixed(2)
    : 0;

  const isProfitable = totalProfitLoss >= 0;

  return (
    <div>
      <h2>Portfolio Summary</h2>
      <p>Total Holdings: {holdings.length}</p>
      <p>Total Investment: ${totalInvestment.toLocaleString()}</p>
      <p>Current Value: ${totalValue.toLocaleString()}</p>
      <p style={{ color: isProfitable ? 'green' : 'red' }}>
        Profit/Loss: ${Math.abs(totalProfitLoss).toLocaleString()} ({profitLossPercentage}%)
      </p>
    </div>
  );
}
```

### Chart with Multiple Timeframes

```javascript
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoHistory } from './store/slices/cryptoSlice';

function PriceChart({ coinId }) {
  const dispatch = useDispatch();
  const [timeframe, setTimeframe] = useState('7d');
  const { cryptoHistory } = useSelector((state) => state.crypto);
  const historyData = cryptoHistory[coinId]?.[timeframe];

  useEffect(() => {
    dispatch(fetchCryptoHistory({ coinId, timeframe }));
  }, [coinId, timeframe, dispatch]);

  const timeframes = ['1h', '24h', '7d', '30d', '1y'];

  return (
    <div>
      <div>
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            disabled={timeframe === tf}
          >
            {tf}
          </button>
        ))}
      </div>
      {historyData && <Chart data={historyData} />}
    </div>
  );
}
```

### Error Handling with Error Boundary

```javascript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <YourApp />
    </ErrorBoundary>
  );
}
```

## API Integration Examples

### Direct API Call

```javascript
import { cryptoAPI } from './services/cryptoAPI';

async function fetchData() {
  try {
    // Get list of cryptocurrencies
    const cryptos = await cryptoAPI.getCryptoList(1, 50, 'usd');
    
    // Get specific coin details
    const bitcoin = await cryptoAPI.getCryptoDetails('bitcoin');
    
    // Get historical data
    const history = await cryptoAPI.getCryptoHistory('bitcoin', '7d', 'usd');
    
    // Search cryptocurrencies
    const results = await cryptoAPI.searchCryptos('ethereum');
    
    return { cryptos, bitcoin, history, results };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
```

### Batch Price Updates

```javascript
import { cryptoAPI } from './services/cryptoAPI';

async function updatePortfolioPrices(holdings) {
  const coinIds = holdings.map((h) => h.coinId);
  const prices = await cryptoAPI.getCurrentPrices(coinIds);
  
  const updatedHoldings = holdings.map((holding) => ({
    ...holding,
    currentPrice: prices[holding.coinId]?.usd || holding.currentPrice,
  }));
  
  return updatedHoldings;
}
```

## Testing Examples

### Component Test

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CryptoCard from './components/CryptoCard';

test('renders crypto card with correct data', () => {
  const mockCrypto = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://example.com/bitcoin.png',
    current_price: 50000,
    price_change_percentage_24h: 5.5,
    market_cap: 1000000000,
  };

  render(
    <Provider store={store}>
      <CryptoCard crypto={mockCrypto} onClick={() => {}} />
    </Provider>
  );

  expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  expect(screen.getByText('BTC')).toBeInTheDocument();
});
```

### Redux Slice Test

```javascript
import portfolioReducer, { addHolding } from './store/slices/portfolioSlice';

test('adds holding to portfolio', () => {
  const initialState = { holdings: [], totalValue: 0 };
  
  const newHolding = {
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'btc',
    amount: 1,
    purchasePrice: 50000,
    currentPrice: 55000,
  };

  const state = portfolioReducer(initialState, addHolding(newHolding));
  
  expect(state.holdings).toHaveLength(1);
  expect(state.holdings[0].coinName).toBe('Bitcoin');
});
```

## Best Practices

1. **Always handle loading and error states**
2. **Use memoization for expensive computations**
3. **Implement debouncing for search inputs**
4. **Clean up intervals and timeouts**
5. **Use error boundaries for graceful error handling**
6. **Keep components small and focused**
7. **Extract reusable logic into custom hooks**
8. **Write tests for critical functionality**
