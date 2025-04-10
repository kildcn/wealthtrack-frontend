// src/api/auth.js
import api from './index';

const AuthService = {
  // Register new user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    const { accessToken, refreshToken, ...userData } = response.data;

    // Only store tokens if they exist in the response
    if (accessToken && refreshToken) {
      // Store tokens in localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
      return userData;
    } else {
      // This will throw an error if tokens aren't present
      throw new Error('Invalid authentication response');
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Update tokens in localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);

    return response.data;
  },

  // Logout user - clear local storage
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },

  // Get current auth status
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Get stored user data
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
};

export default AuthService;
