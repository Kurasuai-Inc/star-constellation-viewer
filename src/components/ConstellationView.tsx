import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Node, Link } from './ForceGraph';

interface ConstellationViewProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}

const ConstellationView: React.FC<ConstellationViewProps> = ({
  nodes,
  links,
  width = 800,
  height = 600
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 100, 1000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 200;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create node meshes
    const nodeMap = new Map<string, THREE.Mesh>();
    const nodeGroup = new THREE.Group();

    nodes.forEach((node, index) => {
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      
      // Different colors for different categories
      const categoryColors: { [key: string]: number } = {
        language: 0x2196f3,
        framework: 0x4caf50,
        tool: 0xff9800,
        algorithm: 0x9c27b0,
        pattern: 0xf44336
      };

      const material = new THREE.MeshPhongMaterial({
        color: categoryColors[node.category] || 0x666666,
        emissive: categoryColors[node.category] || 0x666666,
        emissiveIntensity: 0.3
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Position nodes in 3D space
      const angle = (index / nodes.length) * Math.PI * 2;
      const radius = 20 + Math.random() * 20;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = (Math.random() - 0.5) * 30;
      mesh.position.z = Math.sin(angle) * radius;

      nodeMap.set(node.id, mesh);
      nodeGroup.add(mesh);

      // Add label sprite
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;
      
      context.font = '24px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(node.name, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(mesh.position);
      sprite.position.y += 3;
      sprite.scale.set(10, 2.5, 1);
      nodeGroup.add(sprite);
    });

    scene.add(nodeGroup);

    // Create links
    const linkGroup = new THREE.Group();
    
    links.forEach((link) => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (sourceNode && targetNode) {
        const points = [
          sourceNode.position,
          targetNode.position
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Different colors for different relationships
        const relationshipColors: { [key: string]: number } = {
          'uses': 0x64b5f6,
          'derives from': 0x81c784,
          'competes with': 0xe57373,
          'complements': 0xffb74d,
          'implements': 0xba68c8
        };
        
        const material = new THREE.LineBasicMaterial({
          color: relationshipColors[link.relationship] || 0x999999,
          opacity: 0.6,
          transparent: true
        });
        
        const line = new THREE.Line(geometry, material);
        linkGroup.add(line);
      }
    });

    scene.add(linkGroup);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate stars
      stars.rotation.y += 0.0001;

      // Slowly rotate the node group
      nodeGroup.rotation.y += 0.001;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [nodes, links, width, height]);

  return <div ref={mountRef} style={{ width, height }} />;
};

export default ConstellationView;