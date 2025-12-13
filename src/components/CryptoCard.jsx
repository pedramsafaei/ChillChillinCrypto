import React from 'react';
import { Card, Row, Col, Typography, Tag, Space } from 'antd';
import { StarOutlined, StarFilled, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';
import millify from 'millify';

const { Text, Title } = Typography;

const CryptoCard = ({ crypto, onClick }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(crypto.id));

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    dispatch(
      toggleFavorite({
        coinId: crypto.id,
        coinName: crypto.name,
        coinSymbol: crypto.symbol,
      })
    );
  };

  const priceChange = crypto.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ marginBottom: '16px', cursor: 'pointer' }}
      extra={
        <div onClick={handleFavoriteClick} style={{ cursor: 'pointer', fontSize: '18px' }}>
          {isFavorite ? (
            <StarFilled style={{ color: '#faad14' }} />
          ) : (
            <StarOutlined style={{ color: '#8c8c8c' }} />
          )}
        </div>
      }
    >
      <Row gutter={16} align="middle">
        <Col xs={24} sm={8}>
          <Space>
            <img src={crypto.image} alt={crypto.name} style={{ width: 40, height: 40 }} />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {crypto.name}
              </Title>
              <Text type="secondary">{crypto.symbol?.toUpperCase()}</Text>
            </div>
          </Space>
        </Col>
        <Col xs={12} sm={6}>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Price
            </Text>
            <Title level={5} style={{ margin: 0 }}>
              ${crypto.current_price?.toLocaleString()}
            </Title>
          </div>
        </Col>
        <Col xs={12} sm={5}>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              24h Change
            </Text>
            <div>
              <Tag color={isPositive ? 'green' : 'red'} icon={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
                {Math.abs(priceChange).toFixed(2)}%
              </Tag>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={5}>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Market Cap
            </Text>
            <Title level={5} style={{ margin: 0 }}>
              ${millify(crypto.market_cap || 0)}
            </Title>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CryptoCard;
