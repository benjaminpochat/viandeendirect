import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the environment configuration for Vite
import { validateEnv } from './config/env';

// Initialize environment validation
validateEnv();

// Create root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Make sure your HTML has a div with id="root"');
}

// Create root and render the app
const root = ReactDOM.createRoot(rootElement);

// Development mode enhancements for Vite
if (import.meta.env.DEV) {
  console.log('🚀 Starting ViandeEnDirect in development mode with Vite');
  console.log('📦 Environment:', import.meta.env.VITE_APP_ENV);
  console.log('🔒 Auth Mode:', import.meta.env.VITE_APP_MODE);
}

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
if (import.meta.env.VITE_APP_ANALYTICS_ENABLED === 'true') {
  reportWebVitals(console.log);
}

export default App;