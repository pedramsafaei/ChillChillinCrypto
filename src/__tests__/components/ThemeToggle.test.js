import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThemeToggle from '../../components/ThemeToggle';
import preferencesReducer from '../../store/slices/preferencesSlice';

const renderWithStore = (component, initialState = {}) => {
  const store = configureStore({
    reducer: {
      preferences: preferencesReducer,
    },
    preloadedState: initialState,
  });
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('ThemeToggle', () => {
  it('should render the theme toggle switch', () => {
    const { container } = renderWithStore(<ThemeToggle />);
    const switchElement = container.querySelector('.ant-switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('should show light theme by default', () => {
    const { container } = renderWithStore(<ThemeToggle />);
    const switchElement = container.querySelector('.ant-switch');
    expect(switchElement).not.toHaveClass('ant-switch-checked');
  });

  it('should show dark theme when theme is dark', () => {
    const initialState = {
      preferences: {
        theme: 'dark',
        currency: 'usd',
        language: 'en',
        notifications: true,
        autoRefresh: true,
        refreshInterval: 60,
        defaultTimeframe: '24h',
        chartType: 'line',
        compactView: false,
      },
    };
    const { container } = renderWithStore(<ThemeToggle />, initialState);
    const switchElement = container.querySelector('.ant-switch');
    expect(switchElement).toHaveClass('ant-switch-checked');
  });
});
