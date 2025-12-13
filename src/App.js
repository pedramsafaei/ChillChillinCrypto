import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { Navbar, ErrorBoundary } from './components';
import './App.css';

const { Content, Footer } = Layout;

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Cryptocurrencies = lazy(() => import('./pages/Cryptocurrencies'));
const CryptoDetails = lazy(() => import('./pages/CryptoDetails'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Settings = lazy(() => import('./pages/Settings'));

const LoadingFallback = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <Spin size="large" />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <Layout className="app">
        <div className="navbar">
          <Navbar />
        </div>
        <Content className="main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
              <Route path="/crypto/:id" element={<CryptoDetails />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </Content>
        <Footer className="footer" style={{ textAlign: 'center' }}>
          ChillChillin Crypto ©{new Date().getFullYear()} - Your Cryptocurrency Companion
        </Footer>
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
