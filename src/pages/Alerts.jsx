import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  Badge,
  message,
  Popconfirm,
  Switch,
  Alert,
} from 'antd';
import { PlusOutlined, BellOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAlert,
  removeAlert,
  toggleAlert,
  checkAlerts,
  dismissTriggeredAlert,
} from '../store/slices/alertsSlice';
import { cryptoAPI } from '../services/cryptoAPI';

const { Title, Text } = Typography;
const { Option } = Select;

const Alerts = () => {
  const dispatch = useDispatch();
  const { alerts, triggeredAlerts } = useSelector((state) => state.alerts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Check alerts periodically
    const checkPrices = async () => {
      if (alerts.length > 0) {
        const enabledAlerts = alerts.filter((a) => a.enabled);
        if (enabledAlerts.length === 0) return;

        const coinIds = [...new Set(enabledAlerts.map((a) => a.coinId))];
        try {
          const prices = await cryptoAPI.getCurrentPrices(coinIds);
          const priceMap = {};
          Object.keys(prices).forEach((coinId) => {
            priceMap[coinId] = prices[coinId].usd;
          });
          dispatch(checkAlerts(priceMap));
        } catch (error) {
          console.error('Error checking alerts:', error);
        }
      }
    };

    checkPrices();
    const interval = setInterval(checkPrices, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [alerts, dispatch]);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
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
      const currentPrice = priceData[coin.id]?.usd;

      if (!currentPrice) {
        message.error('Could not fetch current price');
        return;
      }

      dispatch(
        addAlert({
          coinId: coin.id,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          targetPrice: values.targetPrice,
          condition: values.condition,
          currentPrice: currentPrice,
          note: values.note,
        })
      );

      message.success('Price alert created successfully');
      handleCancel();
    } catch (error) {
      message.error('Failed to create alert');
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    dispatch(removeAlert(id));
    message.success('Alert deleted successfully');
  };

  const handleToggle = (id) => {
    dispatch(toggleAlert(id));
  };

  const handleDismiss = (id) => {
    dispatch(dismissTriggeredAlert(id));
  };

  const columns = [
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Switch checked={record.enabled} onChange={() => handleToggle(record.id)} />
      ),
      width: 80,
    },
    {
      title: 'Cryptocurrency',
      key: 'crypto',
      render: (_, record) => (
        <div>
          <Text strong>{record.coinName}</Text>
          <br />
          <Text type="secondary">{record.coinSymbol?.toUpperCase()}</Text>
        </div>
      ),
    },
    {
      title: 'Condition',
      key: 'condition',
      render: (_, record) => (
        <Badge
          status={record.condition === 'above' ? 'success' : 'error'}
          text={record.condition === 'above' ? 'Above' : 'Below'}
        />
      ),
    },
    {
      title: 'Target Price',
      dataIndex: 'targetPrice',
      key: 'targetPrice',
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this alert?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Title level={2}>Price Alerts</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal} size="large">
          Create Alert
        </Button>
      </div>

      {triggeredAlerts.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>
            <BellOutlined /> Triggered Alerts
          </Title>
          {triggeredAlerts.map((alert) => (
            <Alert
              key={alert.id}
              message={`${alert.coinName} (${alert.coinSymbol?.toUpperCase()})`}
              description={`Price ${alert.condition} $${alert.targetPrice.toLocaleString()}. Current price: $${alert.triggeredPrice.toLocaleString()}`}
              type="success"
              closable
              onClose={() => handleDismiss(alert.id)}
              style={{ marginBottom: '8px' }}
            />
          ))}
        </div>
      )}

      <Card>
        <Table
          columns={columns}
          dataSource={alerts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title="Create Price Alert"
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
            <Input placeholder="e.g., Bitcoin" />
          </Form.Item>
          <Form.Item
            name="condition"
            label="Alert Condition"
            rules={[{ required: true, message: 'Please select a condition' }]}
            initialValue="above"
          >
            <Select>
              <Option value="above">Price goes above</Option>
              <Option value="below">Price goes below</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="targetPrice"
            label="Target Price (USD)"
            rules={[{ required: true, message: 'Please enter target price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              prefix="$"
              placeholder="0.00"
            />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} placeholder="Optional note..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Alert
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Alerts;
