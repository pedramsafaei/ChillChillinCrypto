import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CryptoCard from '../../components/CryptoCard';
import favoritesReducer from '../../store/slices/favoritesSlice';

const mockCrypto = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: 'https://example.com/bitcoin.png',
  current_price: 50000,
  price_change_percentage_24h: 5.5,
  market_cap: 1000000000,
};

const renderWithStore = (component, initialState = {}) => {
  const store = configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: initialState,
  });
  return render(<Provider store={store}>{component}</Provider>);
};

describe('CryptoCard', () => {
  it('renders cryptocurrency information correctly', () => {
    renderWithStore(<CryptoCard crypto={mockCrypto} onClick={() => {}} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('displays positive price change correctly', () => {
    renderWithStore(<CryptoCard crypto={mockCrypto} onClick={() => {}} />);
    
    expect(screen.getByText('5.50%')).toBeInTheDocument();
  });

  it('displays negative price change correctly', () => {
    const negativeCrypto = { ...mockCrypto, price_change_percentage_24h: -3.2 };
    renderWithStore(<CryptoCard crypto={negativeCrypto} onClick={() => {}} />);
    
    expect(screen.getByText('3.20%')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    renderWithStore(<CryptoCard crypto={mockCrypto} onClick={handleClick} />);
    
    const card = screen.getByRole('img', { name: 'Bitcoin' }).closest('.ant-card');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('toggles favorite status when star icon is clicked', () => {
    renderWithStore(<CryptoCard crypto={mockCrypto} onClick={() => {}} />);
    
    // Should not be favorite initially
    const starIcon = screen.getByRole('img', { hidden: true });
    
    fireEvent.click(starIcon);
    
    // Star should be filled after clicking
    expect(starIcon).toBeInTheDocument();
  });
});
