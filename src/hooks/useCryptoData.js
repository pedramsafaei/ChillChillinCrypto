import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoDetails, fetchCryptoHistory } from '../store/slices/cryptoSlice';

/**
 * Custom hook for fetching and accessing cryptocurrency data
 * @param {string} coinId - The cryptocurrency ID
 * @returns {object} Cryptocurrency data and loading state
 */
export const useCryptoData = (coinId) => {
  const dispatch = useDispatch();
  const { cryptoDetails, loading, error } = useSelector((state) => state.crypto);
  const crypto = cryptoDetails[coinId];

  useEffect(() => {
    if (coinId && !crypto) {
      dispatch(fetchCryptoDetails(coinId));
    }
  }, [coinId, crypto, dispatch]);

  return { crypto, loading, error };
};

/**
 * Custom hook for fetching cryptocurrency history
 * @param {string} coinId - The cryptocurrency ID
 * @param {string} timeframe - The timeframe for history
 * @returns {object} Historical data and loading state
 */
export const useCryptoHistory = (coinId, timeframe = '7d') => {
  const dispatch = useDispatch();
  const { cryptoHistory, loading, error } = useSelector((state) => state.crypto);
  const history = cryptoHistory[coinId]?.[timeframe];

  useEffect(() => {
    if (coinId && !history) {
      dispatch(fetchCryptoHistory({ coinId, timeframe }));
    }
  }, [coinId, timeframe, history, dispatch]);

  return { history, loading, error };
};
