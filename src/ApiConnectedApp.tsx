import React, { useState, useEffect } from 'react';
import StarConstellationGraph from './components/StarConstellationGraph';
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

function ApiConnectedApp() {
  const [activeView, setActiveView] = useState<'2d' | '3d'>('2d');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // セイラのAPIからデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/graph');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        
        setNodes(data.nodes);
        
        // ノードのlinksからリンクデータを生成
        const generatedLinks: Link[] = [];
        data.nodes.forEach(node => {
          node.links.forEach(targetId => {
            generatedLinks.push({
              source: node.id,
              target: targetId,
              relationship: 'related'
            });
          });
        });
        
        setLinks(generatedLinks);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // カテゴリー分類の関数
  const getCategoryFromTags = (tags: string[]): string => {
    if (tags.some(tag => tag.includes('プログラミング言語'))) return 'language';
    if (tags.some(tag => tag.includes('フレームワーク'))) return 'framework';
    if (tags.some(tag => tag.includes('開発ツール'))) return 'tool';
    if (tags.some(tag => tag.includes('データベース'))) return 'database';
    if (tags.some(tag => tag.includes('アルゴリズム'))) return 'algorithm';
    if (tags.some(tag => tag.includes('デザインパターン'))) return 'pattern';
    if (tags.some(tag => tag.includes('クラウド'))) return 'cloud';
    return 'other';
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🌌 Star Constellation Viewer</h1>
          <p>知識ネットワークを星座として可視化</p>
        </header>
        <main className="graph-container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '1.2rem'
          }}>
            <div>
              <div>📡 セイラのAPIからデータを読み込み中...</div>
              <div style={{ marginTop: '1rem', opacity: 0.7 }}>
                知識の銀河を構築しています ✨
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🌌 Star Constellation Viewer</h1>
          <p>知識ネットワークを星座として可視化</p>
        </header>
        <main className="graph-container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: '#e57373'
          }}>
            <div>
              <h3>❌ データ取得エラー</h3>
              <p>{error}</p>
              <p>セイラのAPIサーバー (localhost:8000) が起動しているか確認してください</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <h2>🌌 Star Constellation Graph</h2>
            <StarConstellationGraph 
              nodes={nodes} 
              links={links} 
              width={Math.min(window.innerWidth * 0.9, 1200)}
              height={Math.min(window.innerHeight * 0.7, 800)}
            />
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
                <div>⭐ 表示中: <strong>50</strong> / 全{nodes.length}ノード</div>
                <div>🔗 表示中: <strong>~100</strong> / 全{links.length}リンク</div>
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
                💡 パフォーマンス改善のため重要度順に表示数を制限
              </div>
            </div>
            
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              marginTop: '2rem'
            }}>
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h3>📊 セイラのデータ統合完了！</h3>
              </div>
              
              {/* カテゴリ別統計 */}
              <div style={{ marginBottom: '2rem' }}>
                <h4>📋 カテゴリ別統計:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {Object.entries(
                    nodes.reduce((acc, node) => {
                      const category = getCategoryFromTags(node.tags);
                      acc[category] = (acc[category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([category, count]) => (
                    <div key={category} style={{
                      padding: '0.5rem 1rem',
                      background: category === 'language' ? '#2196f3' :
                                 category === 'framework' ? '#4caf50' :
                                 category === 'tool' ? '#ff9800' :
                                 category === 'database' ? '#9c27b0' :
                                 category === 'algorithm' ? '#f44336' :
                                 category === 'pattern' ? '#795548' :
                                 category === 'cloud' ? '#00bcd4' : '#666',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{category}</div>
                      <div>{count} ノード</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* サンプルノード表示 */}
              <div style={{ marginBottom: '2rem' }}>
                <h4>🌟 主要ノード (最初の10個):</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {nodes.slice(0, 10).map(node => (
                    <div key={node.id} style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{node.title}</div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                        {node.content.substring(0, 100)}...
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                        🏷️ {node.tags.slice(0, 3).join(', ')}
                        {node.tags.length > 3 && ` +${node.tags.length - 3}`}
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
                        🔗 {node.links.length} 関連
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
                <p>🎨 次のステップ: D3.js可視化機能を追加予定</p>
                <p>💫 セイラの508リンクで美しい星座が完成します！</p>
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
                <p>現在は2D表示で{nodes.length}ノードの知識銀河をお楽しみください</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Created by Stella & Seira with 💫</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          データ提供: セイラのFastAPI | 表示: ステラのReact UI
        </p>
      </footer>
    </div>
  );
}

export default ApiConnectedApp;