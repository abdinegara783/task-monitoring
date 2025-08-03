# 📚 Dokumentasi API Endpoints

## 🚀 Task Monitoring API v1.1.0

Backend API sederhana untuk belajar Django REST Framework dengan User Management

---

## 📋 Daftar Endpoint

### 1. **Hello World** 👋
- **URL:** `GET /api/hello/`
- **Deskripsi:** Endpoint sederhana untuk testing koneksi
- **Response:**
```json
{
  "message": "Hello World from Django!",
  "status": "success",
  "timestamp": "2025-08-03T11:35:24.123456Z"
}
```

### 2. **API Info** ℹ️
- **URL:** `GET /api/info/`
- **Deskripsi:** Informasi tentang API
- **Response:**
```json
{
  "api_name": "Task Monitoring API",
  "version": "1.1.0",
  "description": "Backend API sederhana untuk belajar Django REST Framework dengan User Management",
  "total_endpoints": 7
}
```

### 3. **Test POST** 📤
- **URL:** `POST /api/test-post/`
- **Deskripsi:** Test endpoint untuk POST request
- **Request Body:** (JSON apa saja)
- **Response:**
```json
{
  "success": true,
  "message": "Data berhasil diterima: {...}",
  "data": {...}
}
```

---

## 👥 User Management Endpoints

### 4. **Get All Users** 📋
- **URL:** `GET /api/users/`
- **Deskripsi:** Mendapatkan daftar semua user
- **Response:**
```json
{
  "total_users": 3,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25,
      "city": "Jakarta"
    },
    {...}
  ],
  "page_info": {
    "current_page": 1,
    "total_pages": 1,
    "has_next": false
  }
}
```

### 5. **Create User** ➕
- **URL:** `POST /api/users/create/`
- **Deskripsi:** Membuat user baru dengan validasi
- **Request Body:**
```json
{
  "name": "Nama Lengkap",
  "email": "email@example.com",
  "age": 25,
  "city": "Jakarta" // opsional
}
```
- **Validasi:**
  - `name`: Maksimal 100 karakter, tidak boleh hanya angka
  - `email`: Format email yang valid
  - `age`: Antara 1-120
  - `city`: Opsional, maksimal 50 karakter

- **Response Success:**
```json
{
  "success": true,
  "message": "User Nama Lengkap berhasil dibuat",
  "data": {
    "id": 4,
    "name": "Nama Lengkap",
    "email": "email@example.com",
    "age": 25,
    "city": "Jakarta"
  }
}
```

- **Response Error:**
```json
{
  "success": false,
  "message": "Data tidak valid",
  "errors": {
    "email": ["Enter a valid email address."]
  }
}
```

### 6. **Get User by ID** 🔍
- **URL:** `GET /api/users/{user_id}/`
- **Deskripsi:** Mendapatkan user berdasarkan ID
- **Parameter:** `user_id` (integer)
- **Response Success:**
```json
{
  "success": true,
  "message": "User ditemukan",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "city": "Jakarta"
  }
}
```

- **Response Not Found:**
```json
{
  "success": false,
  "message": "User dengan ID 999 tidak ditemukan"
}
```

### 7. **Delete User** 🗑️
- **URL:** `DELETE /api/users/{user_id}/delete/`
- **Deskripsi:** Menghapus user berdasarkan ID
- **Parameter:** `user_id` (integer)
- **Response Success:**
```json
{
  "success": true,
  "message": "User John Doe berhasil dihapus",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "city": "Jakarta"
  }
}
```

---

## 🧪 Testing dengan cURL

### Get All Users
```bash
curl -X GET http://127.0.0.1:8000/api/users/
```

### Create New User
```bash
curl -X POST http://127.0.0.1:8000/api/users/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": 25,
    "city": "Jakarta"
  }'
```

### Get User by ID
```bash
curl -X GET http://127.0.0.1:8000/api/users/1/
```

### Delete User
```bash
curl -X DELETE http://127.0.0.1:8000/api/users/1/delete/
```

---

## 🎓 Konsep yang Dipelajari

1. **Serializers Django** - Validasi dan format data
2. **CRUD Operations** - Create, Read, Update, Delete
3. **HTTP Methods** - GET, POST, DELETE
4. **URL Parameters** - Dynamic routing dengan parameter
5. **Error Handling** - Validasi input dan response error
6. **Data Validation** - Custom validation methods
7. **JSON Response** - Struktur response yang konsisten

---

## 🔧 Fitur Serializer

- **Validasi Otomatis:** Email format, range umur
- **Custom Validation:** Nama tidak boleh hanya angka
- **Field Optional:** City bersifat opsional
- **Error Messages:** Pesan error yang jelas
- **Data Transformation:** Format data yang konsisten

---

## 📝 Catatan untuk Pemula

1. **Database Simulasi:** Menggunakan list Python (dalam aplikasi nyata gunakan Django Models)
2. **Serializer Validation:** Semua input divalidasi sebelum diproses
3. **HTTP Status Codes:** Menggunakan status code yang tepat (200, 201, 400, 404)
4. **Consistent Response:** Semua response menggunakan format yang konsisten
5. **Error Handling:** Menangani berbagai jenis error dengan baik

Selamat belajar! 🚀