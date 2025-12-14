import favoritesReducer, {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  selectIsFavorite,
} from '../../store/slices/favoritesSlice';

describe('favoritesSlice', () => {
  const initialState = {
    items: [],
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addFavorite', () => {
    const newFavorite = {
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'btc',
    };

    const actual = favoritesReducer(initialState, addFavorite(newFavorite));
    
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].coinName).toBe('Bitcoin');
    expect(actual.items[0].coinId).toBe('bitcoin');
  });

  it('should not add duplicate favorites', () => {
    const favorite = {
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'btc',
    };

    let state = favoritesReducer(initialState, addFavorite(favorite));
    state = favoritesReducer(state, addFavorite(favorite));
    
    expect(state.items).toHaveLength(1);
  });

  it('should handle removeFavorite', () => {
    const stateWithFavorite = {
      ...initialState,
      items: [
        {
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          coinSymbol: 'btc',
          addedAt: '2023-01-01',
        },
      ],
    };

    const actual = favoritesReducer(stateWithFavorite, removeFavorite('bitcoin'));
    
    expect(actual.items).toHaveLength(0);
  });

  it('should handle toggleFavorite - add', () => {
    const newFavorite = {
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'btc',
    };

    const actual = favoritesReducer(initialState, toggleFavorite(newFavorite));
    
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].coinId).toBe('bitcoin');
  });

  it('should handle toggleFavorite - remove', () => {
    const stateWithFavorite = {
      ...initialState,
      items: [
        {
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          coinSymbol: 'btc',
          addedAt: '2023-01-01',
        },
      ],
    };

    const actual = favoritesReducer(
      stateWithFavorite,
      toggleFavorite({ coinId: 'bitcoin' })
    );
    
    expect(actual.items).toHaveLength(0);
  });

  it('should handle clearFavorites', () => {
    const stateWithFavorites = {
      ...initialState,
      items: [
        { coinId: 'bitcoin', coinName: 'Bitcoin', coinSymbol: 'btc' },
        { coinId: 'ethereum', coinName: 'Ethereum', coinSymbol: 'eth' },
      ],
    };

    const actual = favoritesReducer(stateWithFavorites, clearFavorites());
    
    expect(actual.items).toHaveLength(0);
  });

  it('should select isFavorite correctly', () => {
    const state = {
      favorites: {
        items: [
          { coinId: 'bitcoin', coinName: 'Bitcoin', coinSymbol: 'btc' },
        ],
      },
    };

    expect(selectIsFavorite('bitcoin')(state)).toBe(true);
    expect(selectIsFavorite('ethereum')(state)).toBe(false);
  });
});
