import React, { useEffect, useState } from 'react';
import { Input, Select, Pagination, Typography, Space, Button, Row, Col } from 'antd';
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoList, setFilters, setPagination, sortCryptoList } from '../store/slices/cryptoSlice';
import CryptoCard from '../components/CryptoCard';
import { CryptoListSkeleton } from '../components/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const Cryptocurrencies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cryptoList, loading, filters, pagination } = useSelector((state) => state.crypto);
  const { currency } = useSelector((state) => state.preferences);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCryptoList({ page: pagination.page, limit: pagination.limit, currency }));
  }, [dispatch, pagination.page, pagination.limit, currency]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ searchQuery: value }));
  };

  const handleSort = (sortBy) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(sortCryptoList({ sortBy, sortOrder: newOrder }));
  };

  const handlePageChange = (page, pageSize) => {
    dispatch(setPagination({ page, limit: pageSize }));
  };

  const handleCryptoClick = (coinId) => {
    navigate(`/crypto/${coinId}`);
  };

  const filteredCryptos = cryptoList.filter((crypto) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      crypto.name.toLowerCase().includes(search) ||
      crypto.symbol.toLowerCase().includes(search)
    );
  });

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>All Cryptocurrencies</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Input
            placeholder="Search cryptocurrencies..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            size="large"
            allowClear
          />
        </Col>
        <Col xs={24} md={12}>
          <Space>
            <Select
              defaultValue="market_cap"
              style={{ width: 200 }}
              size="large"
              onChange={(value) => handleSort(value)}
            >
              <Option value="market_cap">Market Cap</Option>
              <Option value="current_price">Price</Option>
              <Option value="price_change_percentage_24h">24h Change</Option>
              <Option value="total_volume">Volume</Option>
            </Select>
            <Button
              size="large"
              icon={
                filters.sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />
              }
              onClick={() => handleSort(filters.sortBy)}
            >
              {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <CryptoListSkeleton count={pagination.limit} />
      ) : (
        <>
          {filteredCryptos.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              onClick={() => handleCryptoClick(crypto.id)}
            />
          ))}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={10000} // CoinGecko API limitation
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '25', '50', '100']}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Cryptocurrencies;
