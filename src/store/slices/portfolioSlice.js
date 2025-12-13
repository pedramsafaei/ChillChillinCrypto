import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadPortfolio = () => {
  try {
    const serialized = localStorage.getItem('portfolio');
    if (serialized === null) return [];
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Error loading portfolio from localStorage:', err);
    return [];
  }
};

// Save to localStorage
const savePortfolio = (portfolio) => {
  try {
    const serialized = JSON.stringify(portfolio);
    localStorage.setItem('portfolio', serialized);
  } catch (err) {
    console.error('Error saving portfolio to localStorage:', err);
  }
};

const initialState = {
  holdings: loadPortfolio(),
  totalValue: 0,
  totalInvestment: 0,
  totalProfitLoss: 0,
  profitLossPercentage: 0,
};

const calculateTotals = (holdings) => {
  let totalValue = 0;
  let totalInvestment = 0;

  holdings.forEach((holding) => {
    totalValue += holding.currentValue || 0;
    totalInvestment += holding.investment || 0;
  });

  const totalProfitLoss = totalValue - totalInvestment;
  const profitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  return {
    totalValue,
    totalInvestment,
    totalProfitLoss,
    profitLossPercentage,
  };
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addHolding: (state, action) => {
      const newHolding = {
        id: Date.now().toString(),
        coinId: action.payload.coinId,
        coinName: action.payload.coinName,
        coinSymbol: action.payload.coinSymbol,
        amount: parseFloat(action.payload.amount),
        purchasePrice: parseFloat(action.payload.purchasePrice),
        currentPrice: parseFloat(action.payload.currentPrice || action.payload.purchasePrice),
        investment: parseFloat(action.payload.amount) * parseFloat(action.payload.purchasePrice),
        currentValue:
          parseFloat(action.payload.amount) *
          parseFloat(action.payload.currentPrice || action.payload.purchasePrice),
        purchaseDate: action.payload.purchaseDate || new Date().toISOString(),
        notes: action.payload.notes || '',
      };

      state.holdings.push(newHolding);
      const totals = calculateTotals(state.holdings);
      Object.assign(state, totals);
      savePortfolio(state.holdings);
    },
    updateHolding: (state, action) => {
      const index = state.holdings.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        const updated = { ...state.holdings[index], ...action.payload };
        updated.investment = updated.amount * updated.purchasePrice;
        updated.currentValue = updated.amount * updated.currentPrice;
        state.holdings[index] = updated;
        const totals = calculateTotals(state.holdings);
        Object.assign(state, totals);
        savePortfolio(state.holdings);
      }
    },
    removeHolding: (state, action) => {
      state.holdings = state.holdings.filter((h) => h.id !== action.payload);
      const totals = calculateTotals(state.holdings);
      Object.assign(state, totals);
      savePortfolio(state.holdings);
    },
    updateCurrentPrices: (state, action) => {
      const priceMap = action.payload;
      state.holdings = state.holdings.map((holding) => {
        if (priceMap[holding.coinId]) {
          return {
            ...holding,
            currentPrice: priceMap[holding.coinId],
            currentValue: holding.amount * priceMap[holding.coinId],
          };
        }
        return holding;
      });
      const totals = calculateTotals(state.holdings);
      Object.assign(state, totals);
      savePortfolio(state.holdings);
    },
    clearPortfolio: (state) => {
      state.holdings = [];
      state.totalValue = 0;
      state.totalInvestment = 0;
      state.totalProfitLoss = 0;
      state.profitLossPercentage = 0;
      localStorage.removeItem('portfolio');
    },
    recalculateTotals: (state) => {
      const totals = calculateTotals(state.holdings);
      Object.assign(state, totals);
    },
  },
});

export const {
  addHolding,
  updateHolding,
  removeHolding,
  updateCurrentPrices,
  clearPortfolio,
  recalculateTotals,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
