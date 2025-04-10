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

    // Store tokens in localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    return userData;
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
};

export default AuthService;
