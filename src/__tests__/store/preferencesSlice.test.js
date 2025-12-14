import preferencesReducer, {
  setTheme,
  setCurrency,
  setLanguage,
  setNotifications,
  resetPreferences,
} from '../../store/slices/preferencesSlice';

describe('preferencesSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    const initialState = preferencesReducer(undefined, { type: 'unknown' });
    expect(initialState).toHaveProperty('theme');
    expect(initialState).toHaveProperty('currency');
  });

  it('should handle setTheme', () => {
    const initialState = preferencesReducer(undefined, { type: 'unknown' });
    const actual = preferencesReducer(initialState, setTheme('dark'));
    expect(actual.theme).toBe('dark');
  });

  it('should handle setCurrency', () => {
    const initialState = preferencesReducer(undefined, { type: 'unknown' });
    const actual = preferencesReducer(initialState, setCurrency('eur'));
    expect(actual.currency).toBe('eur');
  });

  it('should handle setLanguage', () => {
    const initialState = preferencesReducer(undefined, { type: 'unknown' });
    const actual = preferencesReducer(initialState, setLanguage('es'));
    expect(actual.language).toBe('es');
  });

  it('should handle setNotifications', () => {
    const initialState = preferencesReducer(undefined, { type: 'unknown' });
    const actual = preferencesReducer(initialState, setNotifications(false));
    expect(actual.notifications).toBe(false);
  });

  it('should handle resetPreferences', () => {
    let state = preferencesReducer(undefined, { type: 'unknown' });
    state = preferencesReducer(state, setTheme('dark'));
    state = preferencesReducer(state, setCurrency('eur'));
    
    const actual = preferencesReducer(state, resetPreferences());
    
    expect(actual.theme).toBe('light');
    expect(actual.currency).toBe('usd');
  });
});
