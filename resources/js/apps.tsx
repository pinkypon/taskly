import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from './context/AuthContext';
import '../css/app.css';

// ✅ Reload early BEFORE React mounts (fix bfcache)
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
