import React, { useState } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { useUsers, useApiInfo, useConnectionTest, useNotification } from '../hooks/useUsers';
import './UserManagement.css';

const UserManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Custom hooks
  const {
    users,
    loading: usersLoading,
    error: usersError,
    createUser,
    deleteUser,
    refreshUsers,
    totalUsers,
    hasUsers,
    clearError
  } = useUsers();
  
  const {
    apiInfo,
    error: apiError
  } = useApiInfo();
  
  const {
    connectionStatus,
    isConnected,
    testConnection,
    loading: connectionLoading
  } = useConnectionTest();
  
  const {
    notifications,
    showSuccess,
    showError,
    showInfo,
    removeNotification
  } = useNotification();

  // Handle create user
  const handleCreateUser = async (userData) => {
    try {
      const result = await createUser(userData);
      
      if (result.success) {
        showSuccess(`User ${result.data.name} berhasil dibuat! 🎉`);
        setShowForm(false);
      } else {
        showError(result.message || 'Gagal membuat user');
      }
    } catch (error) {
      showError(error.message || 'Terjadi kesalahan saat membuat user');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    const userName = user?.name || 'User';
    
    // Konfirmasi sebelum hapus
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus user "${userName}"?\n\nTindakan ini tidak dapat dibatalkan.`
    );
    
    if (!confirmed) return;
    
    try {
      const result = await deleteUser(userId);
      
      if (result.success) {
        showSuccess(`User ${userName} berhasil dihapus! 🗑️`);
        // Clear selected user if it was deleted
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
        }
      } else {
        showError(result.message || 'Gagal menghapus user');
      }
    } catch (error) {
      showError(error.message || 'Terjadi kesalahan saat menghapus user');
    }
  };

  // Handle select user for viewing details
  const handleSelectUser = (user) => {
    console.log('🔍 handleSelectUser called with:', user);
    try {
      if (!user) {
        console.error('❌ User data is null or undefined');
        showError('Data user tidak valid');
        return;
      }
      
      if (!user.name) {
        console.error('❌ User name is missing:', user);
        showError('Data user tidak lengkap');
        return;
      }
      
      setSelectedUser(user);
      showInfo(`Menampilkan detail user: ${user.name}`);
      console.log('✅ User selected successfully:', user.name);
    } catch (error) {
      console.error('❌ Error in handleSelectUser:', error);
      showError('Terjadi kesalahan saat memilih user');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refreshUsers();
    showInfo('Memuat ulang data users...');
  };

  // Handle test connection
  const handleTestConnection = async () => {
    const result = await testConnection();
    if (result.success) {
      showSuccess('Koneksi ke server berhasil! ✅');
    } else {
      showError(result.message || 'Gagal terhubung ke server');
    }
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="user-management-header">
        <div className="header-content">
          <h1>👥 User Management System</h1>
          <p>Kelola data user dengan mudah menggunakan Django REST API</p>
        </div>
        
        {/* Connection Status */}
        <div className={`connection-status ${connectionStatus}`}>
          <div className="status-indicator"></div>
          <span>Status: {isConnected ? 'Terhubung' : 'Terputus'}</span>
          <button 
            onClick={handleTestConnection}
            disabled={connectionLoading}
            className="test-connection-btn"
          >
            {connectionLoading ? '🔄' : '🔌'} Test
          </button>
        </div>
      </div>

      {/* API Info */}
      {apiInfo && (
        <div className="api-info-banner">
          <div className="api-info-content">
            <h3>📡 {apiInfo.api_name}</h3>
            <div className="api-details">
              <span>v{apiInfo.version}</span>
              <span>•</span>
              <span>{apiInfo.total_endpoints} endpoints</span>
              <span>•</span>
              <span>{apiInfo.description}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification ${notification.type}`}
              onClick={() => removeNotification(notification.id)}
            >
              <span className="notification-message">{notification.message}</span>
              <button className="notification-close">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {(usersError || apiError) && (
        <div className="error-banner">
          <div className="error-content">
            <h3>❌ Terjadi Kesalahan</h3>
            <p>{usersError || apiError}</p>
            <div className="error-actions">
              <button onClick={clearError} className="btn-dismiss">
                Tutup
              </button>
              <button onClick={handleRefresh} className="btn-retry">
                🔄 Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Actions */}
      <div className="main-actions">
        <div className="actions-left">
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`btn-primary ${showForm ? 'active' : ''}`}
          >
            {showForm ? '❌ Batal' : '➕ Tambah User'}
          </button>
          
          <button 
            onClick={handleRefresh}
            disabled={usersLoading}
            className="btn-secondary"
          >
            {usersLoading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
        
        <div className="actions-right">
          <div className="user-stats">
            <span className="stat-item">
              👥 Total: <strong>{totalUsers}</strong>
            </span>
            {hasUsers && (
              <span className="stat-item">
                📊 Status: <strong>Aktif</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User Form */}
      {showForm && (
        <UserForm
          onSubmit={handleCreateUser}
          loading={usersLoading}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Selected User Details */}
      {selectedUser && (
        <div className="selected-user-details">
          <div className="details-header">
            <h3>👤 Detail User</h3>
            <button 
              onClick={() => setSelectedUser(null)}
              className="btn-close"
            >
              ×
            </button>
          </div>
          <div className="details-content">
            <div className="detail-item">
              <strong>ID:</strong> {selectedUser.id}
            </div>
            <div className="detail-item">
              <strong>Nama:</strong> {selectedUser.name}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div className="detail-item">
              <strong>Umur:</strong> {selectedUser.age} tahun
            </div>
            {selectedUser.city && (
              <div className="detail-item">
                <strong>Kota:</strong> {selectedUser.city}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User List */}
      <UserList
        users={users}
        onDeleteUser={handleDeleteUser}
        onSelectUser={handleSelectUser}
        loading={usersLoading}
      />

      {/* Footer Info */}
      <div className="footer-info">
        <div className="footer-content">
          <p>🚀 Dibuat dengan Django REST Framework + React</p>
          <div className="footer-links">
            <span>📚 Untuk pembelajaran</span>
            <span>•</span>
            <span>🔧 CRUD Operations</span>
            <span>•</span>
            <span>✅ Serializers Validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;