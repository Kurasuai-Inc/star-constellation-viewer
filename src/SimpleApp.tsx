import React from 'react';

function SimpleApp() {
  return (
    <div style={{ 
      background: '#000', 
      color: '#fff', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        🌌 Star Constellation Viewer
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        知識ネットワークを星座として可視化
      </p>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '2rem', 
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <h2>✅ Vite + React 動作確認</h2>
        <p>アプリケーションが正常に表示されています！</p>
        <p>現在時刻: {new Date().toLocaleString('ja-JP')}</p>
      </div>
    </div>
  );
}

export default SimpleApp;