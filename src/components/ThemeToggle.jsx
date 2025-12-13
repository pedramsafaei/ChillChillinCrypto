import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/preferencesSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.preferences);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={handleToggle}
      checkedChildren={<BulbFilled />}
      unCheckedChildren={<BulbOutlined />}
    />
  );
};

export default ThemeToggle;
