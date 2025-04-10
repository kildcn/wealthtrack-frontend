import api from './index';

const UserService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update current user profile
  updateUserProfile: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Update user profile error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default UserService;
