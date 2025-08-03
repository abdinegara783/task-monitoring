import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State sederhana untuk data
  const [helloData, setHelloData] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postResult, setPostResult] = useState(null);
  
  // URL API - sederhana dan jelas
  const API_BASE_URL = 'http://localhost:8000';
  
  // Fungsi untuk mengambil data Hello World
  const fetchHelloWorld = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hello/`);
      setHelloData(response.data);
      console.log('✅ Hello World data:', response.data);
    } catch (err) {
      console.error('❌ Error fetching hello world:', err);
      setError('Gagal mengambil data hello world');
    }
  };
  
  // Fungsi untuk mengambil info API
  const fetchApiInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/info/`);
      setApiInfo(response.data);
      console.log('✅ API Info data:', response.data);
    } catch (err) {
      console.error('❌ Error fetching API info:', err);
      setError('Gagal mengambil info API');
    }
  };
  
  // Fungsi untuk test POST request
  const testPostRequest = async () => {
    try {
      const testData = {
        name: 'Test User',
        message: 'Hello from frontend!',
        timestamp: new Date().toISOString()
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/test-post/`, testData);
      setPostResult(response.data);
      console.log('✅ POST response:', response.data);
    } catch (err) {
      console.error('❌ Error in POST request:', err);
      setError('Gagal mengirim data POST');
    }
  };
  
  // Load data saat component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      await fetchHelloWorld();
      await fetchApiInfo();
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Tampilkan loading
  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading data dari backend...</p>
          </div>
        </header>
      </div>
    );
  }

  // Tampilkan error jika ada
  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="error-message">
            <h2>❌ Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>🔄 Coba Lagi</button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Belajar Django + React</h1>
        <p className="subtitle">Contoh sederhana komunikasi Frontend dan Backend</p>
        
        <div className="hello-world-container">
          {/* Card Hello World */}
          <div className="message-card">
            <h2>📨 Data dari Backend (GET)</h2>
            {helloData ? (
              <div>
                <p className="hello-message">{helloData.message}</p>
                <p className="status">Status: {helloData.status}</p>
                <p className="timestamp">Waktu: {new Date(helloData.timestamp).toLocaleString()}</p>
              </div>
            ) : (
              <p>Tidak ada data</p>
            )}
          </div>
          
          {/* Card API Info */}
          {apiInfo && (
            <div className="api-info-card">
              <h2>ℹ️ Informasi API</h2>
              <p><strong>Nama:</strong> {apiInfo.api_name}</p>
              <p><strong>Versi:</strong> {apiInfo.version}</p>
              <p><strong>Deskripsi:</strong> {apiInfo.description}</p>
              <p><strong>Total Endpoints:</strong> {apiInfo.total_endpoints}</p>
            </div>
          )}
          
          {/* Card POST Result */}
          {postResult && (
            <div className="post-result-card">
              <h2>📤 Hasil POST Request</h2>
              <p><strong>Status:</strong> {postResult.success ? '✅ Berhasil' : '❌ Gagal'}</p>
              <p><strong>Pesan:</strong> {postResult.message}</p>
              {postResult.data && (
                <div className="post-data">
                  <p><strong>Data yang dikirim:</strong></p>
                  <pre>{JSON.stringify(postResult.data, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          
          {/* Tombol-tombol aksi */}
          <div className="action-buttons">
            <button onClick={fetchHelloWorld} className="refresh-btn">
              🔄 Refresh Hello World
            </button>
            
            <button onClick={fetchApiInfo} className="info-btn">
              ℹ️ Refresh API Info
            </button>
            
            <button onClick={testPostRequest} className="post-btn">
              📤 Test POST Request
            </button>
          </div>
          
          {/* Info untuk pemula */}
          <div className="learning-info">
            <h3>🎓 Untuk Pemula:</h3>
            <ul>
              <li><strong>GET Request:</strong> Mengambil data dari server (Hello World & API Info)</li>
              <li><strong>POST Request:</strong> Mengirim data ke server (Test POST)</li>
              <li><strong>Serializers:</strong> Memvalidasi dan memformat data di backend</li>
              <li><strong>Axios:</strong> Library untuk melakukan HTTP requests</li>
            </ul>
            <p className="api-url">🔗 Backend API: <code>{API_BASE_URL}</code></p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
