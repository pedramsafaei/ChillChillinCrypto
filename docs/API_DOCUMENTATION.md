# API Documentation

## Overview

ChillChillin Crypto uses the [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data. This document outlines the API integration and available endpoints.

## Setup

### Environment Variables

Configure the following environment variables in your `.env` file:

```env
REACT_APP_CRYPTO_API_URL=https://api.coingecko.com/api/v3
REACT_APP_CRYPTO_API_KEY=your_api_key_here
```

### API Key

CoinGecko offers a free tier with rate limits:
- **Free Tier**: 50 calls/minute
- **Demo Tier**: 500 calls/minute
- **Pro Tier**: Unlimited calls

Get your API key at: https://www.coingecko.com/en/api/pricing

## API Service Layer

### Architecture

The application uses a centralized API service layer located in `src/services/`:

```
src/services/
├── axiosConfig.js       # Axios instance with interceptors
└── cryptoAPI.js         # API methods
```

### Axios Configuration

The `axiosConfig.js` file provides:
- Request/Response interceptors
- Automatic retry logic (3 attempts with exponential backoff)
- Error handling
- Timeout configuration (10 seconds)

## Available Endpoints

### 1. Get Cryptocurrency List

Fetch a paginated list of cryptocurrencies with market data.

**Method**: `getCryptoList(page, limit, currency)`

**Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `currency` (string): Currency for prices (default: 'usd')

**Example**:
```javascript
import { cryptoAPI } from './services/cryptoAPI';

const cryptos = await cryptoAPI.getCryptoList(1, 50, 'usd');
```

**Response**:
```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://...",
    "current_price": 50000,
    "market_cap": 1000000000,
    "price_change_percentage_24h": 5.5,
    "sparkline_in_7d": { ... }
  }
]
```

### 2. Get Cryptocurrency Details

Fetch detailed information about a specific cryptocurrency.

**Method**: `getCryptoDetails(coinId)`

**Parameters**:
- `coinId` (string): Coin identifier (e.g., 'bitcoin')

**Example**:
```javascript
const details = await cryptoAPI.getCryptoDetails('bitcoin');
```

**Response**:
```json
{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "description": { ... },
  "market_data": { ... },
  "community_data": { ... },
  "developer_data": { ... }
}
```

### 3. Get Historical Data

Fetch historical market data for charts.

**Method**: `getCryptoHistory(coinId, timeframe, currency)`

**Parameters**:
- `coinId` (string): Coin identifier
- `timeframe` (string): '1h', '24h', '7d', '30d', '1y' (default: '7d')
- `currency` (string): Currency for prices (default: 'usd')

**Example**:
```javascript
const history = await cryptoAPI.getCryptoHistory('bitcoin', '7d', 'usd');
```

**Response**:
```json
{
  "prices": [[timestamp, price], ...],
  "market_caps": [[timestamp, market_cap], ...],
  "total_volumes": [[timestamp, volume], ...]
}
```

### 4. Get Trending Coins

Fetch currently trending cryptocurrencies.

**Method**: `getTrendingCoins()`

**Example**:
```javascript
const trending = await cryptoAPI.getTrendingCoins();
```

**Response**:
```json
{
  "coins": [
    {
      "item": {
        "id": "bitcoin",
        "name": "Bitcoin",
        "symbol": "BTC",
        "small": "https://..."
      }
    }
  ]
}
```

### 5. Get Global Statistics

Fetch global cryptocurrency market statistics.

**Method**: `getGlobalStats()`

**Example**:
```javascript
const stats = await cryptoAPI.getGlobalStats();
```

**Response**:
```json
{
  "active_cryptocurrencies": 10000,
  "total_market_cap": { "usd": 2000000000000 },
  "total_volume": { "usd": 100000000000 },
  "market_cap_change_percentage_24h_usd": 5.5
}
```

### 6. Search Cryptocurrencies

Search for cryptocurrencies by name or symbol.

**Method**: `searchCryptos(query)`

**Parameters**:
- `query` (string): Search term

**Example**:
```javascript
const results = await cryptoAPI.searchCryptos('bitcoin');
```

**Response**:
```json
{
  "coins": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "thumb": "https://..."
    }
  ]
}
```

### 7. Get Current Prices

Fetch current prices for multiple coins.

**Method**: `getCurrentPrices(coinIds, currency)`

**Parameters**:
- `coinIds` (array): Array of coin IDs
- `currency` (string): Currency for prices (default: 'usd')

**Example**:
```javascript
const prices = await cryptoAPI.getCurrentPrices(['bitcoin', 'ethereum'], 'usd');
```

**Response**:
```json
{
  "bitcoin": {
    "usd": 50000,
    "usd_24h_change": 5.5
  },
  "ethereum": {
    "usd": 3000,
    "usd_24h_change": 3.2
  }
}
```

### 8. Get Top Gainers

Fetch top performing cryptocurrencies.

**Method**: `getTopGainers(currency, limit)`

**Parameters**:
- `currency` (string): Currency for prices (default: 'usd')
- `limit` (number): Number of results (default: 10)

**Example**:
```javascript
const gainers = await cryptoAPI.getTopGainers('usd', 10);
```

### 9. Get Top Losers

Fetch worst performing cryptocurrencies.

**Method**: `getTopLosers(currency, limit)`

**Parameters**:
- `currency` (string): Currency for prices (default: 'usd')
- `limit` (number): Number of results (default: 10)

**Example**:
```javascript
const losers = await cryptoAPI.getTopLosers('usd', 10);
```

### 10. Convert Currency

Convert amount from one cryptocurrency to another.

**Method**: `convertCurrency(fromCurrency, toCurrency, amount)`

**Parameters**:
- `fromCurrency` (string): Source currency ID
- `toCurrency` (string): Target currency
- `amount` (number): Amount to convert

**Example**:
```javascript
const converted = await cryptoAPI.convertCurrency('bitcoin', 'usd', 1);
```

## Error Handling

### API Errors

The service layer handles various error scenarios:

```javascript
try {
  const data = await cryptoAPI.getCryptoList();
} catch (error) {
  // Error is already logged by interceptor
  console.error('Failed to fetch data:', error.message);
}
```

### Common Error Codes

- **429**: Rate limit exceeded
- **500-504**: Server errors (automatically retried)
- **Network Error**: Connection issues (automatically retried)

### Retry Logic

Failed requests are automatically retried:
- Maximum 3 retry attempts
- Exponential backoff (2^n seconds)
- Only for network errors and timeouts

## Rate Limiting

### Best Practices

1. **Cache responses** when possible
2. **Use pagination** for large datasets
3. **Implement debouncing** for search
4. **Batch requests** when fetching multiple coins
5. **Monitor usage** to avoid hitting limits

### Implementation Example

```javascript
// Debounce search queries
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const results = await cryptoAPI.searchCryptos(query);
  setSearchResults(results);
}, 500);
```

## Redux Integration

### Async Thunks

API calls are integrated with Redux Toolkit:

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cryptoAPI } from '../../services/cryptoAPI';

export const fetchCryptoList = createAsyncThunk(
  'crypto/fetchCryptoList',
  async ({ page, limit, currency }, { rejectWithValue }) => {
    try {
      return await cryptoAPI.getCryptoList(page, limit, currency);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Usage in Components

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoList } from '../store/slices/cryptoSlice';

function CryptoList() {
  const dispatch = useDispatch();
  const { cryptoList, loading } = useSelector((state) => state.crypto);

  useEffect(() => {
    dispatch(fetchCryptoList({ page: 1, limit: 50, currency: 'usd' }));
  }, [dispatch]);

  // Render component
}
```

## Testing

### Mocking API Calls

```javascript
import { cryptoAPI } from './services/cryptoAPI';

jest.mock('./services/cryptoAPI');

test('fetches crypto list', async () => {
  const mockData = [{ id: 'bitcoin', name: 'Bitcoin' }];
  cryptoAPI.getCryptoList.mockResolvedValue(mockData);

  const result = await cryptoAPI.getCryptoList();
  expect(result).toEqual(mockData);
});
```

## Additional Resources

- [CoinGecko API Documentation](https://www.coingecko.com/en/api/documentation)
- [Rate Limiting Guidelines](https://www.coingecko.com/en/api/pricing)
- [API Status Page](https://status.coingecko.com/)

## Support

For API-related issues:
1. Check CoinGecko status page
2. Verify API key is valid
3. Review rate limit usage
4. Contact CoinGecko support if needed
