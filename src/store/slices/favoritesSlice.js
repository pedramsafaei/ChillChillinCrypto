import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadFavorites = () => {
  try {
    const serialized = localStorage.getItem('favorites');
    if (serialized === null) return [];
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Error loading favorites from localStorage:', err);
    return [];
  }
};

// Save to localStorage
const saveFavorites = (favorites) => {
  try {
    const serialized = JSON.stringify(favorites);
    localStorage.setItem('favorites', serialized);
  } catch (err) {
    console.error('Error saving favorites to localStorage:', err);
  }
};

const initialState = {
  items: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const { coinId, coinName, coinSymbol } = action.payload;
      const exists = state.items.find((item) => item.coinId === coinId);
      if (!exists) {
        state.items.push({
          coinId,
          coinName,
          coinSymbol,
          addedAt: new Date().toISOString(),
        });
        saveFavorites(state.items);
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((item) => item.coinId !== action.payload);
      saveFavorites(state.items);
    },
    toggleFavorite: (state, action) => {
      const { coinId, coinName, coinSymbol } = action.payload;
      const index = state.items.findIndex((item) => item.coinId === coinId);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          coinId,
          coinName,
          coinSymbol,
          addedAt: new Date().toISOString(),
        });
      }
      saveFavorites(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem('favorites');
    },
    isFavorite: (state, action) => {
      return state.items.some((item) => item.coinId === action.payload);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites, isFavorite } =
  favoritesSlice.actions;

export const selectIsFavorite = (coinId) => (state) =>
  state.favorites.items.some((item) => item.coinId === coinId);

export default favoritesSlice.reducer;
