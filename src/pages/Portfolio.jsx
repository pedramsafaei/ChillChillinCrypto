import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addHolding,
  updateHolding,
  removeHolding,
  updateCurrentPrices,
} from '../store/slices/portfolioSlice';
import { searchCryptos } from '../store/slices/cryptoSlice';
import { cryptoAPI } from '../services/cryptoAPI';
import millify from 'millify';
import moment from 'moment';

const { Title, Text } = Typography;

const Portfolio = () => {
  const dispatch = useDispatch();
  const { holdings, totalValue, totalInvestment, totalProfitLoss, profitLossPercentage } =
    useSelector((state) => state.portfolio);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingHolding, setEditingHolding] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Update current prices periodically
    const updatePrices = async () => {
      if (holdings.length > 0) {
        const coinIds = holdings.map((h) => h.coinId);
        try {
          const prices = await cryptoAPI.getCurrentPrices(coinIds);
          const priceMap = {};
          Object.keys(prices).forEach((coinId) => {
            priceMap[coinId] = prices[coinId].usd;
          });
          dispatch(updateCurrentPrices(priceMap));
        } catch (error) {
          console.error('Error updating prices:', error);
        }
      }
    };

    updatePrices();
    const interval = setInterval(updatePrices, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [holdings, dispatch]);

  const showModal = (holding = null) => {
    setEditingHolding(holding);
    if (holding) {
      form.setFieldsValue({
        ...holding,
        purchaseDate: moment(holding.purchaseDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingHolding(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingHolding) {
        dispatch(
          updateHolding({
            id: editingHolding.id,
            ...values,
            purchaseDate: values.purchaseDate.toISOString(),
          })
        );
        message.success('Holdings updated successfully');
      } else {
        // Search for coin to get details
        const searchResults = await cryptoAPI.searchCryptos(values.coinName);
        const coin = searchResults.find((c) =>
          c.name.toLowerCase().includes(values.coinName.toLowerCase())
        );

        if (!coin) {
          message.error('Cryptocurrency not found');
          return;
        }

        // Get current price
        const priceData = await cryptoAPI.getCurrentPrices([coin.id]);
        const currentPrice = priceData[coin.id]?.usd || values.purchasePrice;

        dispatch(
          addHolding({
            coinId: coin.id,
            coinName: coin.name,
            coinSymbol: coin.symbol,
            amount: values.amount,
            purchasePrice: values.purchasePrice,
            currentPrice: currentPrice,
            purchaseDate: values.purchaseDate.toISOString(),
            notes: values.notes,
          })
        );
        message.success('Holdings added successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('Failed to save holdings');
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    dispatch(removeHolding(id));
    message.success('Holdings deleted successfully');
  };

  const columns = [
    {
      title: 'Cryptocurrency',
      key: 'crypto',
      render: (_, record) => (
        <Space>
          <div>
            <Text strong>{record.coinName}</Text>
            <br />
            <Text type="secondary">{record.coinSymbol?.toUpperCase()}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => amount.toFixed(8),
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Investment',
      dataIndex: 'investment',
      key: 'investment',
      render: (investment) => `$${investment.toLocaleString()}`,
    },
    {
      title: 'Current Value',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Profit/Loss',
      key: 'profitLoss',
      render: (_, record) => {
        const profitLoss = record.currentValue - record.investment;
        const percentage = (profitLoss / record.investment) * 100;
        const isPositive = profitLoss >= 0;
        return (
          <Space direction="vertical" size={0}>
            <Text style={{ color: isPositive ? '#3f8600' : '#cf1322' }}>
              {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              ${Math.abs(profitLoss).toLocaleString()}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {percentage.toFixed(2)}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title="Are you sure you want to delete this holding?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isProfitable = totalProfitLoss >= 0;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>My Portfolio</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large">
          Add Holdings
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Investment" value={totalInvestment} prefix="$" precision={2} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Current Value"
              value={totalValue}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Profit/Loss"
              value={Math.abs(totalProfitLoss)}
              prefix={isProfitable ? '+$' : '-$'}
              precision={2}
              valueStyle={{ color: isProfitable ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Return"
              value={Math.abs(profitLossPercentage)}
              suffix="%"
              precision={2}
              valueStyle={{ color: isProfitable ? '#3f8600' : '#cf1322' }}
              prefix={
                isProfitable ? <ArrowUpOutlined /> : <ArrowDownOutlined />
              }
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={holdings}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingHolding ? 'Edit Holdings' : 'Add Holdings'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="coinName"
            label="Cryptocurrency"
            rules={[{ required: true, message: 'Please enter cryptocurrency name' }]}
          >
            <Input placeholder="e.g., Bitcoin" disabled={!!editingHolding} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.00000001}
              placeholder="0.00"
            />
          </Form.Item>
          <Form.Item
            name="purchasePrice"
            label="Purchase Price (USD)"
            rules={[{ required: true, message: 'Please enter purchase price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              prefix="$"
              placeholder="0.00"
            />
          </Form.Item>
          <Form.Item
            name="purchaseDate"
            label="Purchase Date"
            rules={[{ required: true, message: 'Please select purchase date' }]}
            initialValue={moment()}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} placeholder="Optional notes..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingHolding ? 'Update' : 'Add'}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Portfolio;
