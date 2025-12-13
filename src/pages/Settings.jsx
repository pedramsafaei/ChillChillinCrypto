import React from 'react';
import { Card, Form, Select, Switch, InputNumber, Typography, Space, Button, message, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrency,
  setNotifications,
  setAutoRefresh,
  setRefreshInterval,
  setDefaultTimeframe,
  setChartType,
  setCompactView,
  resetPreferences,
} from '../store/slices/preferencesSlice';
import { clearFavorites } from '../store/slices/favoritesSlice';
import { clearPortfolio } from '../store/slices/portfolioSlice';
import { clearAllAlerts } from '../store/slices/alertsSlice';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.preferences);

  const handleCurrencyChange = (value) => {
    dispatch(setCurrency(value));
    message.success('Currency preference updated');
  };

  const handleNotificationsChange = (checked) => {
    dispatch(setNotifications(checked));
    message.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleAutoRefreshChange = (checked) => {
    dispatch(setAutoRefresh(checked));
    message.success(`Auto-refresh ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleRefreshIntervalChange = (value) => {
    dispatch(setRefreshInterval(value * 1000));
    message.success('Refresh interval updated');
  };

  const handleTimeframeChange = (value) => {
    dispatch(setDefaultTimeframe(value));
    message.success('Default timeframe updated');
  };

  const handleChartTypeChange = (value) => {
    dispatch(setChartType(value));
    message.success('Chart type updated');
  };

  const handleCompactViewChange = (checked) => {
    dispatch(setCompactView(checked));
    message.success(`Compact view ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleResetPreferences = () => {
    dispatch(resetPreferences());
    message.success('Preferences reset to defaults');
  };

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
    message.success('Favorites cleared');
  };

  const handleClearPortfolio = () => {
    dispatch(clearPortfolio());
    message.success('Portfolio cleared');
  };

  const handleClearAlerts = () => {
    dispatch(clearAllAlerts());
    message.success('All alerts cleared');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Settings</Title>

      <Card title="Display Preferences" style={{ marginBottom: '16px' }}>
        <Form layout="vertical">
          <Form.Item label="Currency">
            <Select
              value={preferences.currency}
              onChange={handleCurrencyChange}
              style={{ width: '100%' }}
            >
              <Option value="usd">USD - US Dollar</Option>
              <Option value="eur">EUR - Euro</Option>
              <Option value="gbp">GBP - British Pound</Option>
              <Option value="jpy">JPY - Japanese Yen</Option>
              <Option value="cad">CAD - Canadian Dollar</Option>
              <Option value="aud">AUD - Australian Dollar</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Default Chart Timeframe">
            <Select
              value={preferences.defaultTimeframe}
              onChange={handleTimeframeChange}
              style={{ width: '100%' }}
            >
              <Option value="1h">1 Hour</Option>
              <Option value="24h">24 Hours</Option>
              <Option value="7d">7 Days</Option>
              <Option value="30d">30 Days</Option>
              <Option value="1y">1 Year</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Chart Type">
            <Select
              value={preferences.chartType}
              onChange={handleChartTypeChange}
              style={{ width: '100%' }}
            >
              <Option value="line">Line Chart</Option>
              <Option value="candlestick">Candlestick Chart</Option>
              <Option value="area">Area Chart</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Compact View">
            <Space>
              <Switch checked={preferences.compactView} onChange={handleCompactViewChange} />
              <Text type="secondary">Show less information in list views</Text>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Data & Updates" style={{ marginBottom: '16px' }}>
        <Form layout="vertical">
          <Form.Item label="Auto-Refresh Data">
            <Space>
              <Switch checked={preferences.autoRefresh} onChange={handleAutoRefreshChange} />
              <Text type="secondary">Automatically refresh cryptocurrency prices</Text>
            </Space>
          </Form.Item>

          {preferences.autoRefresh && (
            <Form.Item label="Refresh Interval (seconds)">
              <InputNumber
                value={preferences.refreshInterval / 1000}
                onChange={handleRefreshIntervalChange}
                min={10}
                max={300}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
        </Form>
      </Card>

      <Card title="Notifications" style={{ marginBottom: '16px' }}>
        <Form layout="vertical">
          <Form.Item label="Enable Notifications">
            <Space>
              <Switch checked={preferences.notifications} onChange={handleNotificationsChange} />
              <Text type="secondary">Receive notifications for price alerts</Text>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Data Management" style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">
            Clear your local data. This action cannot be undone.
          </Text>
          <Divider />
          <Space wrap>
            <Button onClick={handleClearFavorites}>Clear Favorites</Button>
            <Button onClick={handleClearPortfolio} danger>
              Clear Portfolio
            </Button>
            <Button onClick={handleClearAlerts}>Clear Alerts</Button>
            <Button onClick={handleResetPreferences}>Reset All Preferences</Button>
          </Space>
        </Space>
      </Card>

      <Card title="About" style={{ marginBottom: '16px' }}>
        <Space direction="vertical">
          <Text>
            <strong>Version:</strong> {process.env.REACT_APP_VERSION || '1.0.0'}
          </Text>
          <Text>
            <strong>Environment:</strong> {process.env.REACT_APP_ENVIRONMENT || 'production'}
          </Text>
          <Text type="secondary">
            ChillChillin Crypto is a comprehensive cryptocurrency tracking application with
            portfolio management, price alerts, and real-time market data.
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default Settings;
