import { useState } from 'react';
import ForceGraph, { Node, Link } from './components/ForceGraph';
import ConstellationView from './components/ConstellationView';
import './App.css';

// サンプルデータ（セイラが作成したデータの一部を模擬）
const sampleNodes: Node[] = [
  // Languages
  { id: 'python', name: 'Python', category: 'language', tags: ['scripting', 'ml', 'web'] },
  { id: 'javascript', name: 'JavaScript', category: 'language', tags: ['web', 'frontend', 'node'] },
  { id: 'typescript', name: 'TypeScript', category: 'language', tags: ['typed', 'web', 'frontend'] },
  { id: 'rust', name: 'Rust', category: 'language', tags: ['systems', 'memory-safe'] },
  { id: 'go', name: 'Go', category: 'language', tags: ['systems', 'concurrent'] },
  
  // Frameworks
  { id: 'react', name: 'React', category: 'framework', tags: ['frontend', 'ui', 'component'] },
  { id: 'vue', name: 'Vue.js', category: 'framework', tags: ['frontend', 'ui', 'reactive'] },
  { id: 'fastapi', name: 'FastAPI', category: 'framework', tags: ['backend', 'api', 'async'] },
  { id: 'django', name: 'Django', category: 'framework', tags: ['backend', 'fullstack', 'orm'] },
  
  // Tools
  { id: 'git', name: 'Git', category: 'tool', tags: ['vcs', 'collaboration'] },
  { id: 'docker', name: 'Docker', category: 'tool', tags: ['container', 'deployment'] },
  { id: 'vscode', name: 'VSCode', category: 'tool', tags: ['editor', 'ide'] },
];

const sampleLinks: Link[] = [
  // Language relationships
  { source: 'typescript', target: 'javascript', relationship: 'derives from', strength: 0.9 },
  
  // Framework to language
  { source: 'react', target: 'javascript', relationship: 'implements', strength: 0.8 },
  { source: 'react', target: 'typescript', relationship: 'uses', strength: 0.7 },
  { source: 'vue', target: 'javascript', relationship: 'implements', strength: 0.8 },
  { source: 'fastapi', target: 'python', relationship: 'implements', strength: 0.9 },
  { source: 'django', target: 'python', relationship: 'implements', strength: 0.9 },
  
  // Competition and complement
  { source: 'react', target: 'vue', relationship: 'competes with', strength: 0.6 },
  { source: 'fastapi', target: 'django', relationship: 'complements', strength: 0.5 },
  
  // Tool relationships
  { source: 'vscode', target: 'typescript', relationship: 'uses', strength: 0.5 },
  { source: 'vscode', target: 'git', relationship: 'uses', strength: 0.4 },
];

function App() {
  const [activeView, setActiveView] = useState<'2d' | '3d'>('2d');
  const [nodes] = useState(sampleNodes);
  const [links] = useState(sampleLinks);

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
          3D Constellation (開発中)
        </button>
      </nav>

      <main className="graph-container">
        {activeView === '2d' && (
          <div>
            <h2>Knowledge Network Graph</h2>
            <ForceGraph 
              nodes={nodes} 
              links={links} 
              width={window.innerWidth * 0.9} 
              height={window.innerHeight * 0.7}
            />
            <div className="legend">
              <h3>凡例</h3>
              <div className="legend-items">
                <div><span className="dot language"></span> プログラミング言語</div>
                <div><span className="dot framework"></span> フレームワーク</div>
                <div><span className="dot tool"></span> 開発ツール</div>
              </div>
              <div className="legend-lines">
                <div><span className="line uses"></span> 使用</div>
                <div><span className="line derives"></span> 派生</div>
                <div><span className="line competes"></span> 競合</div>
                <div><span className="line complements"></span> 補完</div>
                <div><span className="line implements"></span> 実装</div>
              </div>
            </div>
          </div>
        )}
        {activeView === '3d' && (
          <div>
            <h2>3D Constellation View</h2>
            <ConstellationView 
              nodes={nodes} 
              links={links} 
              width={window.innerWidth * 0.9} 
              height={window.innerHeight * 0.7}
            />
            <div className="legend">
              <h3>操作方法</h3>
              <p>🖱️ マウスドラッグ: 視点回転 | スクロール: ズーム</p>
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

export default App;