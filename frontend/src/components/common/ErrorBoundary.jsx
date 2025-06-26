import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <AlertTriangle 
                  className="mx-auto h-12 w-12 text-red-500 mb-4" 
                  aria-hidden="true"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                  We're sorry, but something unexpected happened. 
                  This error has been logged and we'll look into it.
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg">
                    <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                      Error Details (Development)
                    </summary>
                    <pre className="text-xs text-red-600 overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={this.handleReload}
                    className="btn btn-primary flex items-center justify-center"
                    aria-label="Reload the page"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="btn btn-secondary flex items-center justify-center"
                    aria-label="Go to homepage"
                  >
                    <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                    Go Home
                  </button>
                </div>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>
                    If this problem persists, please contact our support team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
