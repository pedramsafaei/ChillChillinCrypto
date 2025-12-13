import React, { useState } from 'react';
import { Button, Menu, Typography, Avatar, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  FundOutlined,
  WalletOutlined,
  HeartOutlined,
  BellOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import ThemeToggle from './ThemeToggle';
import icon from '../images/avatar.jpeg';

const Navbar = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: '/cryptocurrencies',
      icon: <FundOutlined />,
      label: <Link to="/cryptocurrencies">Cryptocurrencies</Link>,
    },
    {
      key: '/portfolio',
      icon: <WalletOutlined />,
      label: <Link to="/portfolio">Portfolio</Link>,
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: <Link to="/favorites">Favorites</Link>,
    },
    {
      key: '/alerts',
      icon: <BellOutlined />,
      label: <Link to="/alerts">Alerts</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size="large" />
        <Typography.Title level={2} className="logo">
          <Link to="/">ChillChillin Crypto</Link>
        </Typography.Title>
        <Button
          className="menu-control-container"
          type="link"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        />
      </div>
      <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
        <ThemeToggle />
      </div>
      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        mode="horizontal"
        items={menuItems}
        className="desktop-menu"
      />
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        className="mobile-drawer"
      >
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="vertical"
          items={menuItems}
          onClick={closeDrawer}
        />
      </Drawer>
    </div>
  );
};

export default Navbar;
