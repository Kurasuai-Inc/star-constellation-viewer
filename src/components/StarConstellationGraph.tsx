import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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

interface StarConstellationGraphProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}

const StarConstellationGraph: React.FC<StarConstellationGraphProps> = ({
  nodes,
  links,
  width = 1200,
  height = 800
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // カテゴリー分類の関数
  const getCategoryFromTags = (tags: string[]): string => {
    if (tags.some(tag => tag.includes('プログラミング言語'))) return 'language';
    if (tags.some(tag => tag.includes('フレームワーク'))) return 'framework';
    if (tags.some(tag => tag.includes('開発ツール'))) return 'tool';
    if (tags.some(tag => tag.includes('データベース'))) return 'database';
    if (tags.some(tag => tag.includes('アルゴリズム'))) return 'algorithm';
    if (tags.some(tag => tag.includes('デザインパターン'))) return 'pattern';
    if (tags.some(tag => tag.includes('クラウド'))) return 'cloud';
    if (tags.some(tag => tag.includes('AI') || tag.includes('機械学習'))) return 'ai';
    if (tags.some(tag => tag.includes('セキュリティ'))) return 'security';
    return 'other';
  };

  // カテゴリー別の色とサイズ
  const getCategoryStyle = (category: string) => {
    const styles = {
      language: { color: '#4fc3f7', size: 8, glow: '#4fc3f7' },
      framework: { color: '#81c784', size: 10, glow: '#81c784' },
      tool: { color: '#ffb74d', size: 7, glow: '#ffb74d' },
      database: { color: '#ba68c8', size: 9, glow: '#ba68c8' },
      algorithm: { color: '#f06292', size: 6, glow: '#f06292' },
      pattern: { color: '#a1887f', size: 6, glow: '#a1887f' },
      cloud: { color: '#4dd0e1', size: 11, glow: '#4dd0e1' },
      ai: { color: '#ff8a65', size: 12, glow: '#ff8a65' },
      security: { color: '#e57373', size: 8, glow: '#e57373' },
      other: { color: '#90a4ae', size: 5, glow: '#90a4ae' }
    };
    return styles[category as keyof typeof styles] || styles.other;
  };

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // SVGをクリア
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('background', 'radial-gradient(ellipse at center, #0a0a2e 0%, #000 100%)');

    // フィルター定義（グロウ効果）
    const defs = svg.append('defs');
    
    // 各カテゴリーごとのグロウフィルター
    const categories = ['language', 'framework', 'tool', 'database', 'algorithm', 'pattern', 'cloud', 'ai', 'security', 'other'];
    categories.forEach(category => {
      const style = getCategoryStyle(category);
      const filter = defs.append('filter')
        .attr('id', `glow-${category}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
      
      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
      
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // パフォーマンス改善: ノード数を制限
    const maxNodes = 50;
    const maxLinks = 100;
    
    // 重要度の高いノードを選択（リンク数順）
    const topNodes = nodes
      .map(node => ({
        ...node,
        linkCount: node.links.length
      }))
      .sort((a, b) => b.linkCount - a.linkCount)
      .slice(0, maxNodes);
    
    const d3Nodes = topNodes.map(node => ({
      ...node,
      category: getCategoryFromTags(node.tags),
      x: Math.random() * width,
      y: Math.random() * height
    }));

    const nodeIds = new Set(d3Nodes.map(n => n.id));
    const d3Links = links
      .filter(link => 
        nodeIds.has(link.source) && nodeIds.has(link.target)
      )
      .slice(0, maxLinks); // リンク数も制限

    // Force Simulationを作成
    const simulation = d3.forceSimulation(d3Nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(d3Links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.3)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    // ズーム機能
    const zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // コンテナグループ
    const g = svg.append('g');

    // リンクを描画（星座の線）
    const link = g.append('g')
      .selectAll('line')
      .data(d3Links)
      .enter().append('line')
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .style('filter', 'drop-shadow(0 0 2px #333)');

    // ノードを描画（星）
    const node = g.append('g')
      .selectAll('g')
      .data(d3Nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // 星の本体（円）
    node.append('circle')
      .attr('r', (d: any) => getCategoryStyle(d.category).size)
      .attr('fill', (d: any) => getCategoryStyle(d.category).color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('filter', (d: any) => `url(#glow-${d.category})`)
      .style('cursor', 'pointer');

    // 星のキラキラ効果
    node.append('circle')
      .attr('r', (d: any) => getCategoryStyle(d.category).size * 0.3)
      .attr('fill', '#fff')
      .attr('opacity', 0.8)
      .style('pointer-events', 'none');

    // ラベル
    node.append('text')
      .text((d: any) => d.title)
      .attr('x', 0)
      .attr('y', (d: any) => -getCategoryStyle(d.category).size - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '10px')
      .style('font-family', 'Arial, sans-serif')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .style('pointer-events', 'none')
      .style('opacity', 0.8);

    // ホバー効果
    node
      .on('mouseover', function(event, d: any) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', getCategoryStyle(d.category).size * 1.5);
        
        d3.select(this).select('text')
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('font-size', '12px');
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', getCategoryStyle(d.category).size);
        
        d3.select(this).select('text')
          .transition()
          .duration(200)
          .style('opacity', 0.8)
          .style('font-size', '10px');
      });

    // アニメーション更新
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // ドラッグ関数
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // キラキラアニメーション（パフォーマンス改善版）
    let animationId: NodeJS.Timeout;
    const sparkle = () => {
      // FPS制限（2秒に1回）
      animationId = setTimeout(() => {
        node.selectAll('circle:nth-child(2)')
          .transition()
          .duration(2000)
          .attr('opacity', Math.random() * 0.6 + 0.4)
          .on('end', sparkle);
      }, 2000);
    };
    sparkle();

    // クリーンアップ
    return () => {
      simulation.stop();
      if (animationId) {
        clearTimeout(animationId);
      }
    };
  }, [nodes, links, width, height]);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        style={{ 
          border: '1px solid #333',
          borderRadius: '12px',
          background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #000 100%)'
        }}
      />
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
        🖱️ ドラッグで星を移動 | スクロールでズーム | ホバーで詳細表示
      </div>
    </div>
  );
};

export default StarConstellationGraph;