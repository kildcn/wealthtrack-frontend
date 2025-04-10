import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './Routes';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="app-container">
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={5000} />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
