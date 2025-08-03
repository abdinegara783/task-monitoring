import axios from 'axios';

// Konfigurasi base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Buat instance axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 detik timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk logging dan error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📥 Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Data yang dikirim tidak valid');
        case 404:
          throw new Error(data.message || 'Data tidak ditemukan');
        case 500:
          throw new Error('Terjadi kesalahan pada server');
        default:
          throw new Error(data.message || `Error ${status}: ${error.message}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } else {
      // Other error
      throw new Error(error.message || 'Terjadi kesalahan yang tidak diketahui');
    }
  }
);

// User Service Class
class UserService {
  // Get all users
  async getAllUsers() {
    try {
      const response = await apiClient.get('/api/users/');
      return {
        success: true,
        data: response.data,
        message: 'Data user berhasil dimuat'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      // Validasi data sebelum dikirim
      this.validateUserData(userData);
      
      const response = await apiClient.post('/api/users/create/', userData);
      return {
        success: true,
        data: response.data,
        message: 'User berhasil dibuat'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('ID user tidak valid');
      }
      
      const response = await apiClient.get(`/api/users/${userId}/`);
      return {
        success: true,
        data: response.data,
        message: 'Data user berhasil dimuat'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('ID user tidak valid');
      }
      
      const response = await apiClient.delete(`/api/users/${userId}/delete/`);
      return {
        success: true,
        data: response.data,
        message: 'User berhasil dihapus'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Test connection to API
  async testConnection() {
    try {
      const response = await apiClient.get('/api/hello/');
      return {
        success: true,
        data: response.data,
        message: 'Koneksi ke API berhasil'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Get API info
  async getApiInfo() {
    try {
      const response = await apiClient.get('/api/info/');
      return {
        success: true,
        data: response.data,
        message: 'Info API berhasil dimuat'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Validate user data before sending
  validateUserData(userData) {
    const errors = [];
    
    // Validate name
    if (!userData.name || !userData.name.trim()) {
      errors.push('Nama wajib diisi');
    } else if (userData.name.trim().length < 2) {
      errors.push('Nama minimal 2 karakter');
    } else if (/^\d+$/.test(userData.name.trim())) {
      errors.push('Nama tidak boleh hanya berisi angka');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !userData.email.trim()) {
      errors.push('Email wajib diisi');
    } else if (!emailRegex.test(userData.email)) {
      errors.push('Format email tidak valid');
    }
    
    // Validate age
    if (!userData.age) {
      errors.push('Umur wajib diisi');
    } else {
      const age = parseInt(userData.age);
      if (isNaN(age) || age < 1 || age > 120) {
        errors.push('Umur harus antara 1-120 tahun');
      }
    }
    
    // Validate city (optional)
    if (userData.city && userData.city.trim().length > 50) {
      errors.push('Nama kota maksimal 50 karakter');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  // Get API configuration
  getConfig() {
    return {
      baseURL: API_BASE_URL,
      timeout: 10000,
      environment: process.env.NODE_ENV || 'development'
    };
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;

// Export individual methods for convenience
export const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  testConnection,
  getApiInfo
} = userService;