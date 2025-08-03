import React, { useState } from 'react';
import './UserForm.css';

const UserForm = ({ onSubmit, loading, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validasi form
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nama wajib diisi';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Nama minimal 2 karakter';
        } else if (/^\d+$/.test(value.trim())) {
          newErrors.name = 'Nama tidak boleh hanya berisi angka';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email wajib diisi';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Format email tidak valid';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'age':
        const ageNum = parseInt(value);
        if (!value) {
          newErrors.age = 'Umur wajib diisi';
        } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          newErrors.age = 'Umur harus antara 1-120 tahun';
        } else {
          delete newErrors.age;
        }
        break;
        
      case 'city':
        if (value.trim().length > 50) {
          newErrors.city = 'Nama kota maksimal 50 karakter';
        } else {
          delete newErrors.city;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validasi real-time jika field sudah pernah disentuh
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi semua field
    const allTouched = {
      name: true,
      email: true,
      age: true,
      city: true
    };
    setTouched(allTouched);
    
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });
    
    if (isValid) {
      // Bersihkan data sebelum submit
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: parseInt(formData.age),
        city: formData.city.trim() || undefined
      };
      
      onSubmit(cleanData);
      
      // Reset form setelah submit
      setFormData({ name: '', email: '', age: '', city: '' });
      setErrors({});
      setTouched({});
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && 
                     formData.name && formData.email && formData.age;

  return (
    <div className="user-form-container">
      <div className="user-form-header">
        <h2>➕ Tambah User Baru</h2>
        <p>Isi form di bawah untuk menambahkan user baru</p>
      </div>
      
      <form onSubmit={handleSubmit} className="user-form">
        {/* Nama */}
        <div className="form-group">
          <label htmlFor="name">👤 Nama Lengkap *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.name ? 'error' : ''} ${touched.name && !errors.name ? 'success' : ''}`}
            placeholder="Masukkan nama lengkap"
            disabled={loading}
          />
          {errors.name && touched.name && (
            <span className="error-message">❌ {errors.name}</span>
          )}
          {!errors.name && touched.name && formData.name && (
            <span className="success-message">✅ Nama valid</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">📧 Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.email ? 'error' : ''} ${touched.email && !errors.email ? 'success' : ''}`}
            placeholder="contoh@email.com"
            disabled={loading}
          />
          {errors.email && touched.email && (
            <span className="error-message">❌ {errors.email}</span>
          )}
          {!errors.email && touched.email && formData.email && (
            <span className="success-message">✅ Email valid</span>
          )}
        </div>

        {/* Umur */}
        <div className="form-group">
          <label htmlFor="age">🎂 Umur *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.age ? 'error' : ''} ${touched.age && !errors.age ? 'success' : ''}`}
            placeholder="Masukkan umur (1-120)"
            min="1"
            max="120"
            disabled={loading}
          />
          {errors.age && touched.age && (
            <span className="error-message">❌ {errors.age}</span>
          )}
          {!errors.age && touched.age && formData.age && (
            <span className="success-message">✅ Umur valid</span>
          )}
        </div>

        {/* Kota */}
        <div className="form-group">
          <label htmlFor="city">📍 Kota (Opsional)</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.city ? 'error' : ''} ${touched.city && !errors.city && formData.city ? 'success' : ''}`}
            placeholder="Masukkan nama kota"
            disabled={loading}
          />
          {errors.city && touched.city && (
            <span className="error-message">❌ {errors.city}</span>
          )}
          {!errors.city && touched.city && formData.city && (
            <span className="success-message">✅ Kota valid</span>
          )}
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
            disabled={loading}
          >
            ❌ Batal
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Menyimpan...
              </>
            ) : (
              '✅ Simpan User'
            )}
          </button>
        </div>
      </form>
      
      <div className="form-help">
        <h4>💡 Tips Pengisian:</h4>
        <ul>
          <li>Nama tidak boleh hanya berisi angka</li>
          <li>Email harus dalam format yang valid</li>
          <li>Umur harus antara 1-120 tahun</li>
          <li>Kota bersifat opsional</li>
        </ul>
      </div>
    </div>
  );
};

export default UserForm;