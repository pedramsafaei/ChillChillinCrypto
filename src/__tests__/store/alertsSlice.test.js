import alertsReducer, {
  addAlert,
  removeAlert,
  toggleAlert,
  clearAllAlerts,
  checkAlerts,
} from '../../store/slices/alertsSlice';

describe('alertsSlice', () => {
  const initialState = {
    alerts: [],
    triggeredAlerts: [],
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(alertsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addAlert', () => {
    const newAlert = {
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'btc',
      targetPrice: 50000,
      condition: 'above',
      currentPrice: 45000,
    };

    const actual = alertsReducer(initialState, addAlert(newAlert));
    
    expect(actual.alerts).toHaveLength(1);
    expect(actual.alerts[0].coinName).toBe('Bitcoin');
    expect(actual.alerts[0].targetPrice).toBe(50000);
  });

  it('should handle removeAlert', () => {
    const stateWithAlert = {
      ...initialState,
      alerts: [
        {
          id: '123',
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          targetPrice: 50000,
        },
      ],
    };

    const actual = alertsReducer(stateWithAlert, removeAlert('123'));
    
    expect(actual.alerts).toHaveLength(0);
  });

  it('should handle toggleAlert', () => {
    const stateWithAlert = {
      ...initialState,
      alerts: [
        {
          id: '123',
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          targetPrice: 50000,
          enabled: true,
        },
      ],
    };

    const actual = alertsReducer(stateWithAlert, toggleAlert('123'));
    
    expect(actual.alerts[0].enabled).toBe(false);
  });

  it('should handle clearAllAlerts', () => {
    const stateWithAlerts = {
      ...initialState,
      alerts: [
        { id: '1', coinId: 'bitcoin' },
        { id: '2', coinId: 'ethereum' },
      ],
    };

    const actual = alertsReducer(stateWithAlerts, clearAllAlerts());
    
    expect(actual.alerts).toHaveLength(0);
  });

  it('should handle checkAlerts - above condition', () => {
    const stateWithAlert = {
      ...initialState,
      alerts: [
        {
          id: '123',
          coinId: 'bitcoin',
          targetPrice: 50000,
          condition: 'above',
          enabled: true,
        },
      ],
    };

    const currentPrices = {
      bitcoin: 51000,
    };

    const actual = alertsReducer(stateWithAlert, checkAlerts(currentPrices));
    
    expect(actual.alerts[0].enabled).toBe(false);
    expect(actual.triggeredAlerts).toHaveLength(1);
  });

  it('should handle checkAlerts - below condition', () => {
    const stateWithAlert = {
      ...initialState,
      alerts: [
        {
          id: '123',
          coinId: 'bitcoin',
          targetPrice: 50000,
          condition: 'below',
          enabled: true,
        },
      ],
    };

    const currentPrices = {
      bitcoin: 49000,
    };

    const actual = alertsReducer(stateWithAlert, checkAlerts(currentPrices));
    
    expect(actual.alerts[0].enabled).toBe(false);
    expect(actual.triggeredAlerts).toHaveLength(1);
  });
});

