import React, { useEffect, useState } from 'react';
import { Typography, Empty, Button } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cryptoAPI } from '../services/cryptoAPI';
import CryptoCard from '../components/CryptoCard';
import { CryptoListSkeleton } from '../components/LoadingSkeleton';

const { Title } = Typography;

const Favorites = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.favorites);
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (items.length === 0) {
        setCryptoData([]);
        return;
      }

      setLoading(true);
      try {
        const coinIds = items.map((item) => item.coinId);
        const response = await cryptoAPI.getCryptoList(1, 250);
        const favorites = response.filter((crypto) => coinIds.includes(crypto.id));
        setCryptoData(favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [items]);

  const handleCryptoClick = (coinId) => {
    navigate(`/crypto/${coinId}`);
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>My Favorites</Title>
        <Empty
          image={<HeartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description="No favorites yet. Start adding cryptocurrencies to your watchlist!"
        >
          <Button type="primary" onClick={() => navigate('/cryptocurrencies')}>
            Browse Cryptocurrencies
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>My Favorites ({items.length})</Title>
      {loading ? (
        <CryptoListSkeleton count={items.length} />
      ) : (
        cryptoData.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            onClick={() => handleCryptoClick(crypto.id)}
          />
        ))
      )}
    </div>
  );
};

export default Favorites;
