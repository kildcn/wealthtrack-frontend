import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../api/auth';
import UserService from '../api/user';
import { toast } from 'react-toastify';

// Create the auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data on init
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          // First try to get from localStorage for quicker loading
          const storedUser = AuthService.getUserData();
          if (storedUser) {
            setUser(storedUser);
          }

          // Then fetch fresh data from API
          try {
            const userData = await UserService.getCurrentUser();
            setUser(userData);
          } catch (apiError) {
            console.error('Failed to load fresh user data:', apiError);
            // Keep using stored user data if API fails
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        // If token is invalid, logout
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const userData = await AuthService.login(credentials);

      // Additional validation - ensure we have user data
      if (!userData || !userData.id) {
        throw new Error('Invalid user data received');
      }

      setUser(userData);
      toast.success('Login successful!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      // Clear any potentially stored invalid data
      AuthService.logout();
      setUser(null);

      // Show appropriate error message
      const message = error.response?.data?.message ||
                     error.message ||
                     'Invalid credentials or server error';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      await AuthService.signup(userData);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout();
    setUser(null);
    toast.info('You have been logged out.');
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await UserService.updateUserProfile(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
