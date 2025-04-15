
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser, isLoading, isConfigError } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (currentUser && !isLoading) {
      navigate('/');
    }
  }, [currentUser, isLoading, navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isConfigError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Configuration Error</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Firebase configuration is incomplete or invalid. Please add your Firebase credentials in the .env file.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-mono mb-2">Required environment variables:</p>
            <ul className="text-sm font-mono list-disc list-inside">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
              <li>VITE_FIREBASE_STORAGE_BUCKET</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm 
            onSuccess={handleSuccess} 
            onRegisterClick={() => setIsLogin(false)} 
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess} 
            onLoginClick={() => setIsLogin(true)} 
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
