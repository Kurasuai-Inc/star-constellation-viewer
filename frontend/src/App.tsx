import React, { useState, useEffect } from 'react';
import StarConstellationGraph from './components/StarConstellationGraph';
import './App.css';

// 型定義
interface Node {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
}

interface Link {
  source: string;
  target: string;
  relationship: string;
}

interface ApiResponse {
  nodes: Node[];
  metadata: {
    total_nodes: number;
    total_links: number;
  };
}

// 共通スタイル
const styles = {
  centerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  statsContainer: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '2rem',
    marginTop: '2rem'
  }
};

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // APIデータ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/graph');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data: ApiResponse = await response.json();
        setNodes(data.nodes);
        
        // リンクデータ生成
        const links: Link[] = data.nodes.flatMap(node => 
          node.links.map(targetId => ({
            source: node.id,
            target: targetId,
            relationship: 'related'
          }))
        );
        setLinks(links);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データ取得エラー');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // カテゴリー分類
  const getCategoryFromTags = (tags: string[]): string => {
    const categoryMap = {
      'プログラミング言語': 'language',
      'フレームワーク': 'framework', 
      '開発ツール': 'tool',
      'データベース': 'database',
      'クラウド': 'cloud'
    };
    
    for (const [tag, category] of Object.entries(categoryMap)) {
      if (tags.some(t => t.includes(tag))) return category;
    }
    return 'other';
  };

  // 共通レイアウト
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="app">
      <header className="app-header">
        <h1>🌌 Star Constellation Viewer</h1>
        <p>知識ネットワークを星座として可視化</p>
      </header>
      <main className="graph-container">{children}</main>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div style={{ ...styles.centerContainer, fontSize: '1.2rem' }}>
          <div>
            <div>📡 データ読み込み中...</div>
            <div style={{ marginTop: '1rem', opacity: 0.7 }}>知識の銀河を構築中 ✨</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ ...styles.centerContainer, color: '#e57373' }}>
          <div>
            <h3>❌ {error}</h3>
            <p>APIサーバー (localhost:8000) を確認してください</p>
          </div>
        </div>
      </Layout>
    );
  }

  // 統計情報コンポーネント
  const Stats = () => {
    const categoryStats = nodes.reduce((acc, node) => {
      const category = getCategoryFromTags(node.tags);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryColors: Record<string, string> = {
      language: '#2196f3', framework: '#4caf50', tool: '#ff9800',
      database: '#9c27b0', cloud: '#00bcd4', other: '#666'
    };

    return (
      <div style={styles.statsContainer}>
        <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>📊 データ統計</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} style={{
              padding: '0.5rem 1rem',
              background: categoryColors[category] || '#666',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold' }}>{category}</div>
              <div>{count}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <h2>🌌 Star Constellation Graph</h2>
      <StarConstellationGraph 
        nodes={nodes} 
        links={links} 
        width={Math.min(window.innerWidth * 0.9, 1200)}
        height={Math.min(window.innerHeight * 0.7, 800)}
      />
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <span>⭐ {Math.min(50, nodes.length)}/{nodes.length}ノード</span>
          <span>🔗 ~{Math.min(100, links.length)}/{links.length}リンク</span>
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
          💡 パフォーマンス最適化のため表示数制限
        </div>
      </div>
      <Stats />
      <footer className="app-footer">
        <p>Created by Stella & Seira with 💫</p>
      </footer>
    </Layout>
  );
}

export default App;