import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface Node {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

export interface Link {
  source: string;
  target: string;
  relationship: 'uses' | 'derives from' | 'competes with' | 'complements' | 'implements';
  strength: number;
}

interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}

const ForceGraph: React.FC<ForceGraphProps> = ({
  nodes,
  links,
  width = 800,
  height = 600
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('background', '#0a0a0a');

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance((d: any) => {
          // Different distances based on relationship type
          const distances = {
            'uses': 100,
            'derives from': 80,
            'competes with': 150,
            'complements': 60,
            'implements': 90
          };
          return distances[d.relationship as keyof typeof distances] || 100;
        })
        .strength((d: any) => d.strength || 0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Add container groups
    const g = svg.append('g');

    // Add zoom behavior
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      }) as any);

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', (d) => {
        // Different colors for different relationship types
        const colors = {
          'uses': '#64b5f6',
          'derives from': '#81c784',
          'competes with': '#e57373',
          'complements': '#ffb74d',
          'implements': '#ba68c8'
        };
        return colors[(d as any).relationship] || '#999';
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt((d as any).strength * 5));

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add circles for nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d) => {
        // Different colors for different categories
        const categoryColors = {
          'language': '#2196f3',
          'framework': '#4caf50',
          'tool': '#ff9800',
          'algorithm': '#9c27b0',
          'pattern': '#f44336'
        };
        return categoryColors[(d as any).category as keyof typeof categoryColors] || '#666';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    node.append('text')
      .text((d) => (d as any).name)
      .attr('x', 0)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif');

    // Add glow effect
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    node.selectAll('circle')
      .style('filter', 'url(#glow)');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
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

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default ForceGraph;