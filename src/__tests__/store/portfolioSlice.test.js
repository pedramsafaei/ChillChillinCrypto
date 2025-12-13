import portfolioReducer, {
  addHolding,
  updateHolding,
  removeHolding,
  clearPortfolio,
} from '../../store/slices/portfolioSlice';

describe('portfolioSlice', () => {
  const initialState = {
    holdings: [],
    totalValue: 0,
    totalInvestment: 0,
    totalProfitLoss: 0,
    profitLossPercentage: 0,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(portfolioReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addHolding', () => {
    const newHolding = {
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'btc',
      amount: 1,
      purchasePrice: 50000,
      currentPrice: 55000,
      purchaseDate: '2023-01-01',
    };

    const actual = portfolioReducer(initialState, addHolding(newHolding));
    
    expect(actual.holdings).toHaveLength(1);
    expect(actual.holdings[0].coinName).toBe('Bitcoin');
    expect(actual.totalInvestment).toBe(50000);
    expect(actual.totalValue).toBe(55000);
    expect(actual.totalProfitLoss).toBe(5000);
  });

  it('should handle removeHolding', () => {
    const stateWithHolding = {
      ...initialState,
      holdings: [
        {
          id: '123',
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          amount: 1,
          investment: 50000,
          currentValue: 55000,
        },
      ],
    };

    const actual = portfolioReducer(stateWithHolding, removeHolding('123'));
    
    expect(actual.holdings).toHaveLength(0);
  });

  it('should handle clearPortfolio', () => {
    const stateWithHoldings = {
      ...initialState,
      holdings: [{ id: '1' }, { id: '2' }],
      totalValue: 100000,
      totalInvestment: 90000,
    };

    const actual = portfolioReducer(stateWithHoldings, clearPortfolio());
    
    expect(actual.holdings).toHaveLength(0);
    expect(actual.totalValue).toBe(0);
    expect(actual.totalInvestment).toBe(0);
  });
});
