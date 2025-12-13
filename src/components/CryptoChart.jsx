import React, { useState, useEffect } from 'react';
import { Card, Radio, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoHistory } from '../store/slices/cryptoSlice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CryptoChart = ({ coinId }) => {
  const dispatch = useDispatch();
  const { cryptoHistory, loading } = useSelector((state) => state.crypto);
  const { theme } = useSelector((state) => state.preferences);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    if (coinId) {
      dispatch(fetchCryptoHistory({ coinId, timeframe }));
    }
  }, [coinId, timeframe, dispatch]);

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  const historyData = cryptoHistory[coinId]?.[timeframe];

  if (loading || !historyData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  const prices = historyData.prices || [];
  const labels = prices.map((item) => {
    const date = new Date(item[0]);
    if (timeframe === '1h' || timeframe === '24h') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const data = prices.map((item) => item[1]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Price',
        data,
        borderColor: theme === 'dark' ? '#1890ff' : '#1890ff',
        backgroundColor: theme === 'dark' ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => `Price: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#666',
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#666',
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Card
      title="Price Chart"
      extra={
        <Radio.Group value={timeframe} onChange={handleTimeframeChange} buttonStyle="solid">
          <Radio.Button value="1h">1H</Radio.Button>
          <Radio.Button value="24h">24H</Radio.Button>
          <Radio.Button value="7d">7D</Radio.Button>
          <Radio.Button value="30d">30D</Radio.Button>
          <Radio.Button value="1y">1Y</Radio.Button>
        </Radio.Group>
      }
    >
      <div style={{ height: 400 }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default CryptoChart;
