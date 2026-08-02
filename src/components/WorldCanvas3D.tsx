import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WorldCanvas3DProps {
  currentPageIndex: number;
}

export const WorldCanvas3D: React.FC<WorldCanvas3DProps> = ({ currentPageIndex }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f051d, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 25);

    // 2. WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xf7e7ce, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xd4af37, 1.5);
    sunLight.position.set(20, 40, 20);
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(0xfadadd, 2, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // 4. Volumetric Particle System (Petals, Fireflies & Stars)
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(0xf7e7ce),
      new THREE.Color(0xd4af37),
      new THREE.Color(0xfadadd),
      new THREE.Color(0xf8c8dc),
      new THREE.Color(0x9333ea),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = Math.random() * 60 - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 5. 3D Terrain Ground Grid
    const terrainGeo = new THREE.PlaneGeometry(200, 200, 40, 40);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2;
      pos.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x140624,
      roughness: 0.8,
      metalness: 0.2,
      wireframe: false,
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -5;
    scene.add(terrain);

    // 6. Camera Destination Control according to Page Index
    const updateCameraPosition = (pageIdx: number) => {
      // Smooth camera interpolation targets
      const targetPos = new THREE.Vector3();
      const targetLookAt = new THREE.Vector3(0, 0, 0);

      switch (pageIdx) {
        case 0: // Darkness Auth
          targetPos.set(0, 2, 15);
          break;
        case 1: // Boot Terminal
          targetPos.set(0, 4, 18);
          break;
        case 2: // Hero Welcome
          targetPos.set(0, 8, 22);
          break;
        case 7: // Our Story
          targetPos.set(-15, 6, 12);
          targetLookAt.set(-10, 0, 0);
          break;
        case 17: // Enchanted Garden
          targetPos.set(10, 12, 15);
          targetLookAt.set(0, 0, -10);
          break;
        case 19: // Girlfriend Day
          targetPos.set(0, 15, 20);
          break;
        case 20: // Grand Finale - High Altitude World Heart Reveal
          targetPos.set(0, 45, 30);
          targetLookAt.set(0, -10, 0);
          break;
        case 21: // Gallery
          targetPos.set(18, 10, 18);
          break;
        default:
          targetPos.set(0, 6, 20);
          break;
      }

      // Smooth Camera Lerp
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(targetLookAt);
    };

    // 7. Mouse Parallax Reaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 8. Resize Listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate particle cloud gently
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Mouse Parallax
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY + 6 - camera.position.y) * 0.02;

      updateCameraPosition(currentPageIndex);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentPageIndex]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};

export default WorldCanvas3D;
