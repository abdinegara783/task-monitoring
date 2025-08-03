import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

// Custom hook untuk mengelola data users
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data.users || []);
        setLastFetch(new Date());
        console.log('✅ Users loaded successfully:', result.data.users?.length || 0, 'users');
      } else {
        setError(result.message);
        console.error('❌ Failed to load users:', result.message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat data users';
      setError(errorMessage);
      console.error('❌ Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new user
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.createUser(userData);
      
      if (result.success) {
        // Add new user to local state
        const newUser = result.data.data;
        setUsers(prevUsers => [...prevUsers, newUser]);
        console.log('✅ User created successfully:', newUser.name);
        return { success: true, data: newUser, message: result.message };
      } else {
        setError(result.message);
        console.error('❌ Failed to create user:', result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Gagal membuat user baru';
      setError(errorMessage);
      console.error('❌ Error creating user:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.deleteUser(userId);
      
      if (result.success) {
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        console.log('✅ User deleted successfully:', result.data.data?.name);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        console.error('❌ Failed to delete user:', result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Gagal menghapus user';
      setError(errorMessage);
      console.error('❌ Error deleting user:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user by ID
  const getUserById = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getUserById(userId);
      
      if (result.success) {
        console.log('✅ User found:', result.data.data?.name);
        return { success: true, data: result.data.data, message: result.message };
      } else {
        setError(result.message);
        console.error('❌ User not found:', result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Gagal mencari user';
      setError(errorMessage);
      console.error('❌ Error finding user:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh users data
  const refreshUsers = useCallback(() => {
    console.log('🔄 Refreshing users data...');
    fetchUsers();
  }, [fetchUsers]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // State
    users,
    loading,
    error,
    lastFetch,
    
    // Actions
    fetchUsers,
    createUser,
    deleteUser,
    getUserById,
    refreshUsers,
    clearError,
    
    // Computed values
    totalUsers: users.length,
    hasUsers: users.length > 0,
    isEmpty: users.length === 0 && !loading
  };
};

// Custom hook untuk API info
export const useApiInfo = () => {
  const [apiInfo, setApiInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApiInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getApiInfo();
      
      if (result.success) {
        setApiInfo(result.data);
        console.log('✅ API info loaded:', result.data.api_name);
      } else {
        setError(result.message);
        console.error('❌ Failed to load API info:', result.message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat info API';
      setError(errorMessage);
      console.error('❌ Error loading API info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiInfo();
  }, [fetchApiInfo]);

  return {
    apiInfo,
    loading,
    error,
    fetchApiInfo,
    clearError: () => setError(null)
  };
};

// Custom hook untuk connection test
export const useConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);
  const [lastTest, setLastTest] = useState(null);

  const testConnection = useCallback(async () => {
    setLoading(true);
    
    try {
      const result = await userService.testConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
        setLastTest(new Date());
        console.log('✅ Connection test successful');
        return { success: true, message: 'Koneksi berhasil' };
      } else {
        setConnectionStatus('failed');
        console.error('❌ Connection test failed:', result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      setConnectionStatus('failed');
      const errorMessage = err.message || 'Gagal menghubungi server';
      console.error('❌ Connection error:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-test connection on mount
  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    connectionStatus,
    loading,
    lastTest,
    testConnection,
    isConnected: connectionStatus === 'connected',
    isFailed: connectionStatus === 'failed'
  };
};

// Custom hook untuk notifications/toasts
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, duration) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message, duration) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};