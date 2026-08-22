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

    // ─── 1. Scene & Atmosphere Setup ───
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080214, 0.018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 24);

    // ─── 2. WebGL Renderer ───
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // ─── 3. Dynamic Cinematic Lighting ───
    const ambientLight = new THREE.AmbientLight(0xf7e7ce, 0.7);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffd700, 2.0);
    goldKeyLight.position.set(15, 30, 20);
    scene.add(goldKeyLight);

    const roseRimLight = new THREE.PointLight(0xff2e8c, 3.5, 60);
    roseRimLight.position.set(-15, -5, 10);
    scene.add(roseRimLight);

    const violetFillLight = new THREE.PointLight(0xa855f7, 2.5, 50);
    violetFillLight.position.set(0, 15, -15);
    scene.add(violetFillLight);

    // ─── 4. Interactive 3D Crystalline Love Heart Core ───
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    // Generate Parametric 3D Heart Geometry
    const create3DHeartGeometry = () => {
      const heartShape = new THREE.Shape();
      const x = 0, y = 0;
      heartShape.moveTo(x + 2.5, y + 2.5);
      heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y, x, y);
      heartShape.bezierCurveTo(x - 3.0, y, x - 3.0, y + 3.5, x - 3.0, y + 3.5);
      heartShape.bezierCurveTo(x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5);
      heartShape.bezierCurveTo(x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5);
      heartShape.bezierCurveTo(x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y);
      heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

      const extrudeSettings = {
        depth: 2.2,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 3,
        bevelSize: 0.8,
        bevelThickness: 0.8,
      };

      const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      geo.center();
      return geo;
    };

    const heartGeo = create3DHeartGeometry();

    // Outer Crystalline Facet Mesh
    const heartCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xff2e8c,
      emissive: 0x9333ea,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      wireframe: false,
    });

    const heartMesh = new THREE.Mesh(heartGeo, heartCrystalMat);
    heartMesh.scale.set(0.35, 0.35, 0.35);
    heartMesh.rotation.x = Math.PI; // Orient heart right-side up
    heartGroup.add(heartMesh);

    // Glowing Wireframe Aura
    const heartWireMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const heartWireMesh = new THREE.Mesh(heartGeo, heartWireMat);
    heartWireMesh.scale.set(0.37, 0.37, 0.37);
    heartWireMesh.rotation.x = Math.PI;
    heartGroup.add(heartWireMesh);

    // Orbital Energy Rings around Heart
    const ringGeo = new THREE.TorusGeometry(3.2, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    heartGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff2e8c,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ringGeo, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    ring2.scale.set(1.2, 1.2, 1.2);
    heartGroup.add(ring2);

    // ─── 5. Swirling Cosmic Love Nebula & Stardust (1,400+ particles) ───
    const particleCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const palette = [
      new THREE.Color(0xffd700), // Pure Gold
      new THREE.Color(0xf7e7ce), // Champagne
      new THREE.Color(0xff2e8c), // Neon Rose
      new THREE.Color(0xfadadd), // Blush Pink
      new THREE.Color(0xa855f7), // Aurora Violet
      new THREE.Color(0x60a5fa), // Celestial Blue
      new THREE.Color(0xffffff), // Diamond White
    ];

    for (let i = 0; i < particleCount; i++) {
      // Create spiral galaxy arm distribution
      const branchAngle = ((i % 4) * Math.PI * 2) / 4;
      const radius = Math.pow(Math.random(), 1.5) * 45 + 2;
      const spinAngle = radius * 0.25;

      const randomX = (Math.random() - 0.5) * (radius * 0.4);
      const randomY = (Math.random() - 0.5) * 16;
      const randomZ = (Math.random() - 0.5) * (radius * 0.4);

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      scales[i] = Math.random() * 1.8 + 0.6;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(scales, 1));

    const starMat = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ─── 6. Procedural 3D Aerodynamic Falling Rose Petals (50 3D meshes) ───
    const petalCount = 45;
    const petalsGroup = new THREE.Group();
    scene.add(petalsGroup);

    const petalCurveGeo = new THREE.SphereGeometry(0.5, 12, 12, 0, Math.PI, 0, Math.PI / 2);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      emissive: 0x660022,
      emissiveIntensity: 0.3,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    interface PetalData {
      mesh: THREE.Mesh;
      speedY: number;
      speedRotX: number;
      speedRotY: number;
      speedRotZ: number;
      swayOffset: number;
      swaySpeed: number;
    }

    const petals: PetalData[] = [];

    for (let i = 0; i < petalCount; i++) {
      const pMesh = new THREE.Mesh(petalCurveGeo, petalMat);
      pMesh.scale.set(Math.random() * 0.6 + 0.5, Math.random() * 0.8 + 0.7, 0.15);
      pMesh.position.set(
        (Math.random() - 0.5) * 50,
        Math.random() * 40 - 10,
        (Math.random() - 0.5) * 40
      );
      petalsGroup.add(pMesh);

      petals.push({
        mesh: pMesh,
        speedY: Math.random() * 0.04 + 0.02,
        speedRotX: (Math.random() - 0.5) * 0.03,
        speedRotY: (Math.random() - 0.5) * 0.03,
        speedRotZ: (Math.random() - 0.5) * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 1.5 + 0.8,
      });
    }

    // ─── 7. Interactive 3D Ripple Shockwave on Click ───
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.4, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.position.set(0, 0, 5);
    scene.add(shockwaveMesh);

    let shockwaveActive = false;
    let shockwaveScale = 1;
    let shockwaveAlpha = 0;

    const triggerShockwave = (worldPos: THREE.Vector3) => {
      shockwaveMesh.position.copy(worldPos);
      shockwaveScale = 0.5;
      shockwaveAlpha = 0.9;
      shockwaveActive = true;
    };

    // ─── 8. Cinematic Camera Vantage Points Choreography ───
    const updateCameraForChapter = (pageIdx: number) => {
      const targetPos = new THREE.Vector3();
      const targetLookAt = new THREE.Vector3(0, 0, 0);

      switch (pageIdx) {
        case 0: // Biometric Security - Deep Nebula Focus
          targetPos.set(0, 2, 18);
          targetLookAt.set(0, 0, 0);
          break;
        case 1: // Terminal Kernel Boot
          targetPos.set(0, 3, 20);
          targetLookAt.set(0, 1, 0);
          break;
        case 2: // Hero Welcome
          targetPos.set(0, 4, 22);
          targetLookAt.set(0, 1, 0);
          break;
        case 3: // Love Envelope
          targetPos.set(-4, 3, 16);
          targetLookAt.set(0, 0, 0);
          break;
        case 4: // Blooming Rose
          targetPos.set(5, 5, 14);
          targetLookAt.set(1, 0, 0);
          break;
        case 5: // Shooting Star
          targetPos.set(0, 12, 25);
          targetLookAt.set(0, 6, 0);
          break;
        case 6: // Heart Sync - Close Crystalline Core
          targetPos.set(0, 0, 10);
          targetLookAt.set(0, 0, 0);
          break;
        case 7: // Milestone Story Tree
          targetPos.set(-10, 6, 16);
          targetLookAt.set(-3, 1, 0);
          break;
        case 8: // Dev Terminal
          targetPos.set(6, 4, 18);
          targetLookAt.set(0, 0, 0);
          break;
        case 10: // Love Protocol Quiz
          targetPos.set(0, 7, 20);
          targetLookAt.set(0, 1, 0);
          break;
        case 11: // Silent Apology
          targetPos.set(-8, 3, 20);
          targetLookAt.set(0, 0, 0);
          break;
        case 13: // Our Universe
          targetPos.set(0, 18, 28);
          targetLookAt.set(0, 0, 0);
          break;
        case 18: // Enchanted Garden
          targetPos.set(8, 9, 16);
          targetLookAt.set(0, 2, -4);
          break;
        case 20: // July 9th Met Day Royal Starburst
          targetPos.set(0, 8, 18);
          targetLookAt.set(0, 2, 0);
          break;
        case 21: // Grand Finale World Heart
          targetPos.set(0, 32, 28);
          targetLookAt.set(0, 0, 0);
          break;
        case 22: // Memory Museum Gallery
          targetPos.set(12, 6, 18);
          targetLookAt.set(0, 1, 0);
          break;
        default:
          targetPos.set(0, 5, 20);
          targetLookAt.set(0, 1, 0);
          break;
      }

      // Smooth Camera Lerp
      camera.position.lerp(targetPos, 0.04);
      camera.lookAt(targetLookAt);
    };

    // ─── 9. Mouse Parallax & Click Interaction ───
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 5;
    };

    const handleClick = (e: MouseEvent) => {
      // Raycast or set 3D shockwave in front of camera
      const vector = new THREE.Vector3(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = 12;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      triggerShockwave(pos);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // ─── 10. Window Resize Listener ───
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ─── 11. Cinematic Render Loop ───
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // 1. Rhythmic Heartbeat Math (Double-thump pulsation)
      const beatPhase = (elapsedTime * 1.3) % 1;
      let pulse = 1;
      if (beatPhase < 0.15) {
        pulse = 1 + Math.sin((beatPhase / 0.15) * Math.PI) * 0.18;
      } else if (beatPhase > 0.22 && beatPhase < 0.37) {
        pulse = 1 + Math.sin(((beatPhase - 0.22) / 0.15) * Math.PI) * 0.12;
      }
      heartMesh.scale.set(0.35 * pulse, 0.35 * pulse, 0.35 * pulse);
      heartWireMesh.scale.set(0.37 * pulse, 0.37 * pulse, 0.37 * pulse);

      // Subtle float and rotation of the Heart Core
      heartGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.6;
      heartGroup.rotation.y = elapsedTime * 0.25;
      heartGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.08;

      // Rotate orbital rings
      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.x = elapsedTime * 0.35;

      // 2. Galaxy Stardust Rotation
      starField.rotation.y = elapsedTime * 0.02;
      starField.rotation.x = Math.sin(elapsedTime * 0.015) * 0.04;

      // 3. 3D Rose Petals Falling Physics
      petals.forEach((p) => {
        p.mesh.position.y -= p.speedY;
        p.mesh.position.x += Math.sin(elapsedTime * p.swaySpeed + p.swayOffset) * 0.02;
        p.mesh.position.z += Math.cos(elapsedTime * p.swaySpeed + p.swayOffset) * 0.015;

        p.mesh.rotation.x += p.speedRotX;
        p.mesh.rotation.y += p.speedRotY;
        p.mesh.rotation.z += p.speedRotZ;

        // Wrap around bottom
        if (p.mesh.position.y < -15) {
          p.mesh.position.y = 25;
          p.mesh.position.x = (Math.random() - 0.5) * 50;
          p.mesh.position.z = (Math.random() - 0.5) * 40;
        }
      });

      // 4. Shockwave expansion
      if (shockwaveActive) {
        shockwaveScale += 0.35;
        shockwaveAlpha -= 0.028;
        shockwaveMesh.scale.set(shockwaveScale, shockwaveScale, 1);
        shockwaveMat.opacity = Math.max(0, shockwaveAlpha);
        shockwaveMesh.lookAt(camera.position);

        if (shockwaveAlpha <= 0) {
          shockwaveActive = false;
        }
      }

      // 5. Mouse Parallax Dampening
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY + 4 - camera.position.y) * 0.02;

      // 6. Camera Choreography
      updateCameraForChapter(currentPageIndex);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // ─── 12. Cleanup ───
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      heartGeo.dispose();
      heartCrystalMat.dispose();
      heartWireMat.dispose();
      ringGeo.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      starGeo.dispose();
      starMat.dispose();
      petalCurveGeo.dispose();
      petalMat.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
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
