import React from 'react';
import { Button, Result } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log error to error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Result
            status="error"
            title="Oops! Something went wrong"
            subTitle="We're sorry for the inconvenience. Please try refreshing the page."
            extra={[
              <Button type="primary" key="home" onClick={this.handleReset}>
                Go Home
              </Button>,
              <Button key="refresh" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>,
            ]}
          >
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  <summary>Error Details (Development Only)</summary>
                  <p>{this.state.error.toString()}</p>
                  <p>{this.state.errorInfo?.componentStack}</p>
                </details>
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
