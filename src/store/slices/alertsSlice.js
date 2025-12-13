import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadAlerts = () => {
  try {
    const serialized = localStorage.getItem('priceAlerts');
    if (serialized === null) return [];
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Error loading alerts from localStorage:', err);
    return [];
  }
};

// Save to localStorage
const saveAlerts = (alerts) => {
  try {
    const serialized = JSON.stringify(alerts);
    localStorage.setItem('priceAlerts', serialized);
  } catch (err) {
    console.error('Error saving alerts to localStorage:', err);
  }
};

const initialState = {
  alerts: loadAlerts(),
  triggeredAlerts: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      const newAlert = {
        id: Date.now().toString(),
        coinId: action.payload.coinId,
        coinName: action.payload.coinName,
        coinSymbol: action.payload.coinSymbol,
        targetPrice: parseFloat(action.payload.targetPrice),
        condition: action.payload.condition, // 'above' or 'below'
        currentPrice: parseFloat(action.payload.currentPrice),
        enabled: true,
        createdAt: new Date().toISOString(),
        note: action.payload.note || '',
      };
      state.alerts.push(newAlert);
      saveAlerts(state.alerts);
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
      saveAlerts(state.alerts);
    },
    updateAlert: (state, action) => {
      const index = state.alerts.findIndex((alert) => alert.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = { ...state.alerts[index], ...action.payload };
        saveAlerts(state.alerts);
      }
    },
    toggleAlert: (state, action) => {
      const index = state.alerts.findIndex((alert) => alert.id === action.payload);
      if (index !== -1) {
        state.alerts[index].enabled = !state.alerts[index].enabled;
        saveAlerts(state.alerts);
      }
    },
    checkAlerts: (state, action) => {
      const currentPrices = action.payload;
      const triggeredNow = [];

      state.alerts = state.alerts.map((alert) => {
        if (!alert.enabled) return alert;

        const currentPrice = currentPrices[alert.coinId];
        if (!currentPrice) return alert;

        const shouldTrigger =
          (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
          (alert.condition === 'below' && currentPrice <= alert.targetPrice);

        if (shouldTrigger) {
          triggeredNow.push({
            ...alert,
            triggeredAt: new Date().toISOString(),
            triggeredPrice: currentPrice,
          });
          return { ...alert, enabled: false };
        }

        return alert;
      });

      if (triggeredNow.length > 0) {
        state.triggeredAlerts = [...triggeredNow, ...state.triggeredAlerts];
        saveAlerts(state.alerts);
      }
    },
    clearTriggeredAlerts: (state) => {
      state.triggeredAlerts = [];
    },
    dismissTriggeredAlert: (state, action) => {
      state.triggeredAlerts = state.triggeredAlerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    clearAllAlerts: (state) => {
      state.alerts = [];
      state.triggeredAlerts = [];
      localStorage.removeItem('priceAlerts');
    },
  },
});

export const {
  addAlert,
  removeAlert,
  updateAlert,
  toggleAlert,
  checkAlerts,
  clearTriggeredAlerts,
  dismissTriggeredAlert,
  clearAllAlerts,
} = alertsSlice.actions;

export default alertsSlice.reducer;
