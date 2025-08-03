import React from 'react';
import './UserList.css';

const UserList = ({ users, onDeleteUser, onSelectUser, loading }) => {
  if (loading) {
    return (
      <div className="user-list-loading">
        <div className="spinner"></div>
        <p>Memuat daftar user...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="user-list-empty">
        <h3>📭 Tidak ada user</h3>
        <p>Belum ada user yang terdaftar. Silakan tambah user baru!</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>👥 Daftar User ({users.length})</h2>
      <div className="user-grid">
        {users.map((user, index) => (
          <div key={user.id || `user-${index}`} className="user-card">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-email">📧 {user.email}</p>
              <p className="user-age">🎂 {user.age} tahun</p>
              {user.city && (
                <p className="user-city">📍 {user.city}</p>
              )}
            </div>
            <div className="user-actions">
              <button 
                className="btn-view"
                onClick={() => onSelectUser(user)}
                title="Lihat Detail"
              >
                👁️ Lihat
              </button>
              <button 
                className="btn-delete"
                onClick={() => onDeleteUser(user.id)}
                title="Hapus User"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;