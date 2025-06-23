import React, { useState, useEffect } from 'react';
import './App.css';

// セイラのAPIデータ型定義
interface Node {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
}

interface ApiResponse {
  nodes: Node[];
}

interface Link {
  source: string;
  target: string;
  relationship: string;
}

function WorkingApp() {
  const [activeView, setActiveView] = useState<'2d' | '3d'>('2d');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌌 Star Constellation Viewer</h1>
        <p>知識ネットワークを星座として可視化</p>
      </header>

      <nav className="view-selector">
        <button 
          className={activeView === '2d' ? 'active' : ''}
          onClick={() => setActiveView('2d')}
        >
          2D Force Graph
        </button>
        <button 
          className={activeView === '3d' ? 'active' : ''}
          onClick={() => setActiveView('3d')}
        >
          3D Constellation
        </button>
      </nav>

      <main className="graph-container">
        {activeView === '2d' && (
          <div>
            <h2>2D Knowledge Network</h2>
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <h3>📊 Data Overview</h3>
              <p>ノード数: {basicNodes.length}</p>
              <p>リンク数: {basicLinks.length}</p>
              
              <div style={{ marginTop: '2rem' }}>
                <h4>ノード一覧:</h4>
                {basicNodes.map(node => (
                  <div key={node.id} style={{ 
                    margin: '0.5rem', 
                    padding: '0.5rem 1rem',
                    background: node.category === 'language' ? '#2196f3' : 
                               node.category === 'framework' ? '#4caf50' : '#ff9800',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {node.name}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h4>リンク一覧:</h4>
                {basicLinks.map((link, i) => (
                  <div key={i} style={{ margin: '0.5rem 0' }}>
                    {link.source} → {link.target} ({link.relationship})
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === '3d' && (
          <div>
            <h2>3D Constellation View</h2>
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3>🌌 3D View Coming Soon</h3>
                <p>Three.js による3D星空表現を準備中...</p>
                <p>現在は2D表示でお楽しみください</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Created by Stella & Seira with 💫</p>
      </footer>
    </div>
  );
}

export default WorkingApp;