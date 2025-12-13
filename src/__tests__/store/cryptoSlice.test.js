import cryptoReducer, {
  setFilters,
  setPagination,
  sortCryptoList,
  clearError,
} from '../../store/slices/cryptoSlice';

describe('cryptoSlice', () => {
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

  it('should return initial state', () => {
    expect(cryptoReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setFilters', () => {
    const actual = cryptoReducer(initialState, setFilters({ searchQuery: 'bitcoin' }));
    expect(actual.filters.searchQuery).toEqual('bitcoin');
  });

  it('should handle setPagination', () => {
    const actual = cryptoReducer(initialState, setPagination({ page: 2, limit: 100 }));
    expect(actual.pagination.page).toEqual(2);
    expect(actual.pagination.limit).toEqual(100);
  });

  it('should handle sortCryptoList', () => {
    const stateWithData = {
      ...initialState,
      cryptoList: [
        { id: '1', market_cap: 1000 },
        { id: '2', market_cap: 2000 },
        { id: '3', market_cap: 500 },
      ],
    };

    const actual = cryptoReducer(
      stateWithData,
      sortCryptoList({ sortBy: 'market_cap', sortOrder: 'asc' })
    );

    expect(actual.cryptoList[0].market_cap).toBe(500);
    expect(actual.cryptoList[2].market_cap).toBe(2000);
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Something went wrong' };
    const actual = cryptoReducer(stateWithError, clearError());
    expect(actual.error).toBeNull();
  });
});
