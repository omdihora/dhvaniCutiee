import React, { useEffect, useRef } from 'react';

interface BackgroundParticlesProps {
  mode?: 'default' | 'nightsky';
}

interface Particle {
  type: 'heart' | 'star' | 'petal' | 'bokeh';
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  twinkleSpeed: number;
  color: string;
  rotation: number;
  vRot: number;
}

interface GlowingOrb {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ mode = 'default' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let particles: Particle[] = [];
    let orbs: GlowingOrb[] = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const colors = [
      '#fadadd', // Blush pink
      '#f8c8dc', // Baby pink
      '#ffd6e8', // Pastel pink
      '#e6d5ff', // Lavender
      '#d8b4fe', // Lilac
      '#b76e79', // Rose gold
      '#ffffff', // Soft white
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 10;

      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      context.bezierCurveTo(-size / 2, -size / 2, -size, topCurveHeight, 0, size);
      context.bezierCurveTo(size, topCurveHeight, size / 2, -size / 2, 0, topCurveHeight);
      context.closePath();
      context.fill();

      context.restore();
    };

    const drawPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = alpha * 0.8;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 6;

      context.beginPath();
      context.ellipse(0, 0, size * 0.4, size, 0, 0, Math.PI * 2);
      context.fill();

      context.restore();
    };

    const initElements = () => {
      particles = [];
      orbs = [];
      const particleCount = mode === 'nightsky' ? 160 : 100;

      for (let i = 0; i < particleCount; i++) {
        const rand = Math.random();
        const type: 'heart' | 'star' | 'petal' | 'bokeh' =
          rand < 0.35 ? 'heart' : rand < 0.7 ? 'star' : rand < 0.88 ? 'petal' : 'bokeh';

        particles.push({
          type,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size:
            type === 'bokeh'
              ? Math.random() * 30 + 15
              : type === 'heart'
              ? Math.random() * 9 + 5
              : type === 'petal'
              ? Math.random() * 8 + 4
              : Math.random() * 2 + 0.8,
          vx: (Math.random() - 0.5) * 0.6,
          vy: type === 'star' ? (Math.random() - 0.5) * 0.3 : -Math.random() * 0.8 - 0.2, // floating up
          alpha: Math.random() * 0.6 + 0.2,
          maxAlpha: Math.random() * 0.6 + 0.3,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.02,
        });
      }

      // Glowing blurred background Orbs
      const orbColors =
        mode === 'nightsky'
          ? ['rgba(139, 92, 246, 0.22)', 'rgba(236, 72, 153, 0.18)', 'rgba(30, 27, 75, 0.35)']
          : ['rgba(248, 200, 220, 0.22)', 'rgba(216, 180, 254, 0.2)', 'rgba(250, 218, 221, 0.18)'];

      for (let i = 0; i < 4; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 250 + 250,
          color: orbColors[i % orbColors.length],
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render glowing background Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius || orb.x > canvas.width + orb.radius) orb.vx *= -1;
        if (orb.y < -orb.radius || orb.y > canvas.height + orb.radius) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Soft mouse ambient flare
      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
      mouseGrad.addColorStop(0, 'rgba(248, 200, 220, 0.14)');
      mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mouseGrad;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 400, 0, Math.PI * 2);
      ctx.fill();

      // Render Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Wrap around top screen for floating hearts/petals
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        p.alpha += p.twinkleSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.15) {
          p.twinkleSpeed *= -1;
        }

        const currentAlpha = Math.max(0.1, Math.min(1, p.alpha));

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
        } else if (p.type === 'bokeh') {
          ctx.save();
          ctx.globalAlpha = currentAlpha * 0.25;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Star
          ctx.save();
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
