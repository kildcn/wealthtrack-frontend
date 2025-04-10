import api from './index';

const UserService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update current user profile
  updateUserProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  }
};

export default UserService;
