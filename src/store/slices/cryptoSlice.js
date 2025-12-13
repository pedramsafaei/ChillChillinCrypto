import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cryptoAPI } from '../../services/cryptoAPI';

// Async thunks
export const fetchCryptoList = createAsyncThunk(
  'crypto/fetchCryptoList',
  async ({ page = 1, limit = 50, currency = 'usd' }, { rejectWithValue }) => {
    try {
      const response = await cryptoAPI.getCryptoList(page, limit, currency);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchCryptoDetails',
  async (coinId, { rejectWithValue }) => {
    try {
      const response = await cryptoAPI.getCryptoDetails(coinId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchCryptoHistory',
  async ({ coinId, timeframe = '7d', currency = 'usd' }, { rejectWithValue }) => {
    try {
      const response = await cryptoAPI.getCryptoHistory(coinId, timeframe, currency);
      return { coinId, timeframe, data: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTrendingCoins = createAsyncThunk(
  'crypto/fetchTrendingCoins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cryptoAPI.getTrendingCoins();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGlobalStats = createAsyncThunk(
  'crypto/fetchGlobalStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cryptoAPI.getGlobalStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchCryptos = createAsyncThunk(
  'crypto/searchCryptos',
  async (query, { rejectWithValue }) => {
    try {
      const response = await cryptoAPI.searchCryptos(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cryptoList: [],
  cryptoDetails: {},
  cryptoHistory: {},
  trendingCoins: [],
  globalStats: {},
  searchResults: [],
  loading: false,
  error: null,
  lastUpdate: null,
  filters: {
    sortBy: 'market_cap',
    sortOrder: 'desc',
    searchQuery: '',
    category: 'all',
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
  },
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setLastUpdate: (state) => {
      state.lastUpdate = new Date().toISOString();
    },
    clearError: (state) => {
      state.error = null;
    },
    sortCryptoList: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.filters.sortBy = sortBy;
      state.filters.sortOrder = sortOrder;
      
      state.cryptoList.sort((a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Crypto List
      .addCase(fetchCryptoList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoList.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptoList = action.payload;
        state.pagination.total = action.payload.length;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchCryptoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Crypto Details
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptoDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Crypto History
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { coinId, timeframe, data } = action.payload;
        if (!state.cryptoHistory[coinId]) {
          state.cryptoHistory[coinId] = {};
        }
        state.cryptoHistory[coinId][timeframe] = data;
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Trending Coins
      .addCase(fetchTrendingCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingCoins = action.payload;
      })
      .addCase(fetchTrendingCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Global Stats
      .addCase(fetchGlobalStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalStats.fulfilled, (state, action) => {
        state.loading = false;
        state.globalStats = action.payload;
      })
      .addCase(fetchGlobalStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Cryptos
      .addCase(searchCryptos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCryptos.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchCryptos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setPagination,
  clearSearchResults,
  setLastUpdate,
  clearError,
  sortCryptoList,
} = cryptoSlice.actions;

export default cryptoSlice.reducer;
