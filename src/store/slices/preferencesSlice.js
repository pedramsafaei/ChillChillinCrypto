import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadPreferences = () => {
  try {
    const serialized = localStorage.getItem('preferences');
    if (serialized === null) {
      return {
        theme: 'light',
        currency: 'usd',
        language: 'en',
        notifications: true,
        autoRefresh: true,
        refreshInterval: 30000,
        defaultTimeframe: '7d',
        chartType: 'line',
        compactView: false,
      };
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Error loading preferences from localStorage:', err);
    return {
      theme: 'light',
      currency: 'usd',
      language: 'en',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30000,
      defaultTimeframe: '7d',
      chartType: 'line',
      compactView: false,
    };
  }
};

// Save to localStorage
const savePreferences = (preferences) => {
  try {
    const serialized = JSON.stringify(preferences);
    localStorage.setItem('preferences', serialized);
  } catch (err) {
    console.error('Error saving preferences to localStorage:', err);
  }
};

const initialState = loadPreferences();

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      savePreferences(state);
      
      // Apply theme to document
      if (action.payload === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      savePreferences(state);
      
      // Apply theme to document
      if (state.theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
      savePreferences(state);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      savePreferences(state);
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      savePreferences(state);
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
      savePreferences(state);
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
      savePreferences(state);
    },
    setDefaultTimeframe: (state, action) => {
      state.defaultTimeframe = action.payload;
      savePreferences(state);
    },
    setChartType: (state, action) => {
      state.chartType = action.payload;
      savePreferences(state);
    },
    setCompactView: (state, action) => {
      state.compactView = action.payload;
      savePreferences(state);
    },
    updatePreferences: (state, action) => {
      Object.assign(state, action.payload);
      savePreferences(state);
    },
    resetPreferences: (state) => {
      const defaults = {
        theme: 'light',
        currency: 'usd',
        language: 'en',
        notifications: true,
        autoRefresh: true,
        refreshInterval: 30000,
        defaultTimeframe: '7d',
        chartType: 'line',
        compactView: false,
      };
      Object.assign(state, defaults);
      savePreferences(state);
      document.body.classList.remove('dark-theme');
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setCurrency,
  setLanguage,
  setNotifications,
  setAutoRefresh,
  setRefreshInterval,
  setDefaultTimeframe,
  setChartType,
  setCompactView,
  updatePreferences,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
