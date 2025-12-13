import React, { useEffect } from 'react';
import { Row, Col, Typography, Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGlobalStats, fetchTrendingCoins, fetchCryptoList } from '../store/slices/cryptoSlice';
import millify from 'millify';
import { CryptoListSkeleton, StatsSkeleton } from '../components/LoadingSkeleton';
import CryptoCard from '../components/CryptoCard';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { globalStats, trendingCoins, cryptoList, loading } = useSelector((state) => state.crypto);
  const { currency } = useSelector((state) => state.preferences);

  useEffect(() => {
    dispatch(fetchGlobalStats());
    dispatch(fetchTrendingCoins());
    dispatch(fetchCryptoList({ page: 1, limit: 10, currency }));
  }, [dispatch, currency]);

  const handleCryptoClick = (coinId) => {
    navigate(`/crypto/${coinId}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Global Cryptocurrency Market Overview</Title>
      
      {loading ? (
        <StatsSkeleton />
      ) : (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Cryptocurrencies"
                value={globalStats.active_cryptocurrencies || 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Market Cap"
                value={millify(globalStats.total_market_cap?.usd || 0)}
                prefix="$"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="24h Trading Volume"
                value={millify(globalStats.total_volume?.usd || 0)}
                prefix="$"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Market Cap Change (24h)"
                value={globalStats.market_cap_change_percentage_24h_usd?.toFixed(2) || 0}
                suffix="%"
                valueStyle={{
                  color: (globalStats.market_cap_change_percentage_24h_usd || 0) >= 0 ? '#3f8600' : '#cf1322',
                }}
                prefix={
                  (globalStats.market_cap_change_percentage_24h_usd || 0) >= 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
              />
            </Card>
          </Col>
        </Row>
      )}

      <Title level={3} style={{ marginTop: '32px' }}>
        Trending Cryptocurrencies
      </Title>
      {loading ? (
        <CryptoListSkeleton count={5} />
      ) : (
        <Row gutter={[16, 16]}>
          {trendingCoins.slice(0, 5).map((coin) => (
            <Col xs={24} key={coin.item?.id}>
              <Card
                hoverable
                onClick={() => handleCryptoClick(coin.item?.id)}
                style={{ cursor: 'pointer' }}
              >
                <Space>
                  <img
                    src={coin.item?.small}
                    alt={coin.item?.name}
                    style={{ width: 40, height: 40 }}
                  />
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {coin.item?.name}
                    </Title>
                    <Typography.Text type="secondary">
                      {coin.item?.symbol}
                    </Typography.Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Title level={3} style={{ marginTop: '32px' }}>
        Top 10 Cryptocurrencies by Market Cap
      </Title>
      {loading ? (
        <CryptoListSkeleton count={10} />
      ) : (
        cryptoList.slice(0, 10).map((crypto) => (
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

export default Home;
