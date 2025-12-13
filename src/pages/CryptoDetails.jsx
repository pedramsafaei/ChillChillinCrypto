import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, Card, Statistic, Tag, Space, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoDetails } from '../store/slices/cryptoSlice';
import { toggleFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';
import { CryptoDetailSkeleton } from '../components/LoadingSkeleton';
import CryptoChart from '../components/CryptoChart';
import millify from 'millify';
import parse from 'html-react-parser';

const { Title, Text, Paragraph } = Typography;

const CryptoDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cryptoDetails, loading } = useSelector((state) => state.crypto);
  const isFavorite = useSelector(selectIsFavorite(id));
  const crypto = cryptoDetails[id];

  useEffect(() => {
    dispatch(fetchCryptoDetails(id));
  }, [dispatch, id]);

  const handleFavoriteToggle = () => {
    dispatch(
      toggleFavorite({
        coinId: id,
        coinName: crypto?.name,
        coinSymbol: crypto?.symbol,
      })
    );
  };

  if (loading || !crypto) {
    return (
      <div style={{ padding: '24px' }}>
        <CryptoDetailSkeleton />
      </div>
    );
  }

  const priceChange = crypto.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="large">
              <img src={crypto.image?.large} alt={crypto.name} style={{ width: 60, height: 60 }} />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {crypto.name}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  {crypto.symbol?.toUpperCase()} | Rank #{crypto.market_cap_rank}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type={isFavorite ? 'primary' : 'default'}
              icon={isFavorite ? <StarFilled /> : <StarOutlined />}
              onClick={handleFavoriteToggle}
              size="large"
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Current Price"
              value={crypto.market_data?.current_price?.usd || 0}
              precision={2}
              prefix="$"
              valueStyle={{ fontSize: '24px' }}
            />
            <Tag
              color={isPositive ? 'green' : 'red'}
              icon={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              style={{ marginTop: '8px' }}
            >
              {Math.abs(priceChange).toFixed(2)}%
            </Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Market Cap"
              value={millify(crypto.market_data?.market_cap?.usd || 0)}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="24h Volume"
              value={millify(crypto.market_data?.total_volume?.usd || 0)}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Circulating Supply"
              value={millify(crypto.market_data?.circulating_supply || 0)}
              suffix={crypto.symbol?.toUpperCase()}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="All-Time High"
              value={crypto.market_data?.ath?.usd || 0}
              precision={2}
              prefix="$"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(crypto.market_data?.ath_date?.usd).toLocaleDateString()}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="All-Time Low"
              value={crypto.market_data?.atl?.usd || 0}
              precision={2}
              prefix="$"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(crypto.market_data?.atl_date?.usd).toLocaleDateString()}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="24h High"
              value={crypto.market_data?.high_24h?.usd || 0}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="24h Low"
              value={crypto.market_data?.low_24h?.usd || 0}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>

      <CryptoChart coinId={id} />

      {crypto.description?.en && (
        <Card title="About" style={{ marginTop: '24px' }}>
          <Paragraph>{parse(crypto.description.en.split('. ')[0] + '.')}</Paragraph>
        </Card>
      )}

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="Links">
            <Space direction="vertical" style={{ width: '100%' }}>
              {crypto.links?.homepage?.[0] && (
                <a href={crypto.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                  Official Website
                </a>
              )}
              {crypto.links?.blockchain_site?.[0] && (
                <a href={crypto.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer">
                  Blockchain Explorer
                </a>
              )}
              {crypto.links?.repos_url?.github?.[0] && (
                <a href={crypto.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                </a>
              )}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Community">
            <Space direction="vertical" style={{ width: '100%' }}>
              {crypto.links?.twitter_screen_name && (
                <Text>
                  Twitter Followers: {millify(crypto.community_data?.twitter_followers || 0)}
                </Text>
              )}
              {crypto.links?.subreddit_url && (
                <Text>
                  Reddit Subscribers: {millify(crypto.community_data?.reddit_subscribers || 0)}
                </Text>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CryptoDetails;
