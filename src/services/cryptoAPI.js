import axiosInstance from './axiosConfig';

const API_BASE_URL =
  process.env.REACT_APP_CRYPTO_API_URL || 'https://api.coingecko.com/api/v3';

const TIMEFRAME_MAP = {
  '1h': 1,
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '1y': 365,
};

export const cryptoAPI = {
  /**
   * Get list of cryptocurrencies
   */
  getCryptoList: async (page = 1, limit = 50, currency = 'usd') => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/coins/markets`, {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: limit,
          page: page,
          sparkline: true,
          price_change_percentage: '1h,24h,7d',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching crypto list:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific cryptocurrency
   */
  getCryptoDetails: async (coinId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: true,
          developer_data: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for ${coinId}:`, error);
      throw error;
    }
  },

  /**
   * Get historical market data for a cryptocurrency
   */
  getCryptoHistory: async (coinId, timeframe = '7d', currency = 'usd') => {
    try {
      const days = TIMEFRAME_MAP[timeframe] || 7;
      const response = await axiosInstance.get(`${API_BASE_URL}/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: currency,
          days: days,
          interval: days === 1 ? 'hourly' : 'daily',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for ${coinId}:`, error);
      throw error;
    }
  },

  /**
   * Get trending cryptocurrencies
   */
  getTrendingCoins: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/search/trending`);
      return response.data.coins;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw error;
    }
  },

  /**
   * Get global cryptocurrency market statistics
   */
  getGlobalStats: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/global`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global stats:', error);
      throw error;
    }
  },

  /**
   * Search for cryptocurrencies
   */
  searchCryptos: async (query) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/search`, {
        params: {
          query: query,
        },
      });
      return response.data.coins;
    } catch (error) {
      console.error('Error searching cryptos:', error);
      throw error;
    }
  },

  /**
   * Get current prices for multiple coins
   */
  getCurrentPrices: async (coinIds, currency = 'usd') => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/simple/price`, {
        params: {
          ids: coinIds.join(','),
          vs_currencies: currency,
          include_24hr_change: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current prices:', error);
      throw error;
    }
  },

  /**
   * Get top gainers
   */
  getTopGainers: async (currency = 'usd', limit = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/coins/markets`, {
        params: {
          vs_currency: currency,
          order: 'price_change_percentage_24h_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      throw error;
    }
  },

  /**
   * Get top losers
   */
  getTopLosers: async (currency = 'usd', limit = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/coins/markets`, {
        params: {
          vs_currency: currency,
          order: 'price_change_percentage_24h_asc',
          per_page: limit,
          page: 1,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top losers:', error);
      throw error;
    }
  },

  /**
   * Convert currency
   */
  convertCurrency: async (fromCurrency, toCurrency, amount) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/simple/price`, {
        params: {
          ids: fromCurrency,
          vs_currencies: toCurrency,
        },
      });
      const rate = response.data[fromCurrency]?.[toCurrency] || 0;
      return amount * rate;
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  },
};

export default cryptoAPI;
