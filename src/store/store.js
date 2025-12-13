import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './slices/cryptoSlice';
import portfolioReducer from './slices/portfolioSlice';
import favoritesReducer from './slices/favoritesSlice';
import preferencesReducer from './slices/preferencesSlice';
import alertsReducer from './slices/alertsSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    portfolio: portfolioReducer,
    favorites: favoritesReducer,
    preferences: preferencesReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['crypto/setLastUpdate'],
      },
    }),
});

export default store;
