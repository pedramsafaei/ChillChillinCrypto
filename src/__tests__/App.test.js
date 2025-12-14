import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import cryptoReducer from '../store/slices/cryptoSlice';
import portfolioReducer from '../store/slices/portfolioSlice';
import favoritesReducer from '../store/slices/favoritesSlice';
import alertsReducer from '../store/slices/alertsSlice';
import preferencesReducer from '../store/slices/preferencesSlice';

const renderApp = () => {
  const store = configureStore({
    reducer: {
      crypto: cryptoReducer,
      portfolio: portfolioReducer,
      favorites: favoritesReducer,
      alerts: alertsReducer,
      preferences: preferencesReducer,
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

describe('App', () => {
  it('should render without crashing', () => {
    renderApp();
    expect(screen.getByText(/ChillChillin Crypto/i)).toBeInTheDocument();
  });

  it('should render the footer with current year', () => {
    renderApp();
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('should render navbar component', () => {
    renderApp();
    // Navbar should be present in the document
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
  });
});
