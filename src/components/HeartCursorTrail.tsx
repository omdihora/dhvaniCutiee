import React, { useEffect, useRef } from 'react';

interface Particle {
  type: 'heart' | 'sparkle' | 'petal';
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
}

export const HeartCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = ['#fadadd', '#f8c8dc', '#ffd6e8', '#e6d5ff', '#d8b4fe', '#b76e79', '#ffffff'];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

    const drawSparkle = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(0, 0, size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 2; i++) {
        const type: 'heart' | 'sparkle' | 'petal' =
          Math.random() < 0.6 ? 'heart' : Math.random() < 0.85 ? 'sparkle' : 'petal';

        particles.push({
          type,
          x: e.clientX + (Math.random() * 10 - 5),
          y: e.clientY + (Math.random() * 10 - 5),
          size: type === 'heart' ? Math.random() * 9 + 6 : Math.random() * 3 + 2,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.6 - 0.6,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: (Math.random() - 0.5) * 0.6,
          vRot: (Math.random() - 0.5) * 0.06,
        });
      }

      if (particles.length > 90) {
        particles = particles.slice(particles.length - 90);
      }
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const speed = Math.random() * 3.5 + 2;
        particles.push({
          type: Math.random() < 0.7 ? 'heart' : 'sparkle',
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 12 + 7,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.016;
        p.rotation += p.vRot;
        p.size *= 0.98;

        if (p.alpha > 0 && p.size > 0.8) {
          if (p.type === 'heart' || p.type === 'petal') {
            drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
          } else {
            drawSparkle(ctx, p.x, p.y, p.size, p.color, p.alpha);
          }
        }
      }

      particles = particles.filter((p) => p.alpha > 0 && p.size > 0.8);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ touchAction: 'none' }}
    />
  );
};
