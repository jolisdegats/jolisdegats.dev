'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface VisitedCountry {
  name: string;
  lat: number;
  lon: number;
}

export const visitedCountries: VisitedCountry[] = [
  // Europe
  { name: 'France', lat: 46.2276, lon: 2.2137 },
  { name: 'Spain', lat: 40.4637, lon: -3.7492 },
  { name: 'Italy', lat: 41.8719, lon: 12.5674 },
  { name: 'Germany', lat: 51.1657, lon: 10.4515 },
  { name: 'Belgium', lat: 50.5039, lon: 4.4699 },
  { name: 'Netherlands', lat: 52.1326, lon: 5.2913 },
  { name: 'Switzerland', lat: 46.8182, lon: 8.2275 },
  { name: 'Austria', lat: 47.5162, lon: 14.5501 },
  { name: 'United Kingdom', lat: 55.3781, lon: -3.4360 },
  { name: 'Portugal', lat: 39.3999, lon: -8.2245 },
  
  // North America
  { name: 'United States', lat: 37.0902, lon: -95.7129 },
  { name: 'Canada', lat: 56.1304, lon: -106.3468 },
  
  // Asia
  { name: 'Japan', lat: 36.2048, lon: 138.2529 },
  { name: 'Thailand', lat: 15.8700, lon: 100.9925 },
  
  // Africa
  { name: 'Morocco', lat: 31.7917, lon: -7.0926 },
  { name: 'Tunisia', lat: 33.8869, lon: 9.5375 },
];


interface GlobeProps {
  visitedCountries?: Array<{
    name: string;
    lat: number;
    lon: number;
  }>;
}

const Globe = ({ visitedCountries = [] }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const markersRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create Earth
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Create texture for earth
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Draw ocean
    ctx.fillStyle = '#1a4f7c';
    ctx.fillRect(0, 0, 1024, 512);
    
    // Draw simplified continents
    ctx.fillStyle = '#2d6a4f';
    
    // North America
    ctx.beginPath();
    ctx.ellipse(200, 180, 80, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.ellipse(280, 340, 40, 70, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.ellipse(520, 170, 50, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Africa
    ctx.beginPath();
    ctx.ellipse(540, 280, 50, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.ellipse(700, 180, 120, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.ellipse(820, 340, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpScale: 0.05,
      specular: new THREE.Color(0x333333),
      shininess: 5
    });
    
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    earthRef.current = earth;

    // Create atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a90d9,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Create markers group
    const markersGroup = new THREE.Group();
    markersRef.current = markersGroup;
    scene.add(markersGroup);

    // Add markers for visited countries
    visitedCountries.forEach((country) => {
      const markerGeometry = new THREE.SphereGeometry(0.03, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      // Convert lat/lon to 3D position
      const phi = (90 - country.lat) * (Math.PI / 180);
      const theta = (country.lon + 180) * (Math.PI / 180);
      
      marker.position.x = -1.02 * Math.sin(phi) * Math.cos(theta);
      marker.position.y = 1.02 * Math.cos(phi);
      marker.position.z = 1.02 * Math.sin(phi) * Math.sin(theta);
      
      markersGroup.add(marker);
      
      // Add glow ring around marker
      const ringGeometry = new THREE.RingGeometry(0.04, 0.06, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff4444, 
        transparent: true, 
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(marker.position);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      markersGroup.add(ring);
    });

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.002;
      }
      if (markersRef.current) {
        markersRef.current.rotation.y += 0.002;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [visitedCountries]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px]"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Globe;