import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Walmart SenseEase</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-walmart-blue mb-4">404</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Page Not Found
              </h1>
              <p className="text-gray-600">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/"
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
              
              <Link
                to="/products"
                className="btn btn-secondary w-full flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Products
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="btn btn-secondary w-full flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
