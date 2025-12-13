import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';

// Initialize theme from preferences
const preferences = localStorage.getItem('preferences');
if (preferences) {
  const { theme } = JSON.parse(preferences);
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
