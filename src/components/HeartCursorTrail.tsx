import React, { useEffect, useRef } from 'react';

interface Particle {
  type: 'heart' | 'sparkle' | 'petal' | 'goldDust';
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
    const colors = [
      '#f7e7ce', // Champagne Gold
      '#d4af37', // Gold
      '#fadadd', // Blush Pink
      '#f8c8dc', // Baby Pink
      '#e6d5ff', // Soft Lavender
      '#b76e79', // Rose Gold
      '#ffffff', // Pure Pearl White
    ];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

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
      context.shadowBlur = 12;

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
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowColor = '#d4af37';
      context.shadowBlur = 8;

      context.beginPath();
      context.ellipse(0, 0, size * 0.5, size * 1.2, 0, 0, Math.PI * 2);
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
      context.shadowBlur = 10;

      context.beginPath();
      context.arc(0, 0, size, 0, Math.PI * 2);
      context.fill();

      // Diamond cross sparkle lines
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-size * 2, 0);
      context.lineTo(size * 2, 0);
      context.moveTo(0, -size * 2);
      context.lineTo(0, size * 2);
      context.stroke();

      context.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;

      for (let i = 0; i < 2; i++) {
        const rand = Math.random();
        const type: 'heart' | 'sparkle' | 'petal' | 'goldDust' =
          rand < 0.35 ? 'goldDust' : rand < 0.65 ? 'sparkle' : rand < 0.85 ? 'heart' : 'petal';

        particles.push({
          type,
          x: e.clientX + (Math.random() * 12 - 6),
          y: e.clientY + (Math.random() * 12 - 6),
          size: type === 'heart' ? Math.random() * 8 + 5 : type === 'petal' ? Math.random() * 5 + 3 : Math.random() * 3.5 + 1.5,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -Math.random() * 1.8 - 0.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: (Math.random() - 0.5) * 0.8,
          vRot: (Math.random() - 0.5) * 0.08,
        });
      }

      if (particles.length > 100) {
        particles = particles.slice(particles.length - 100);
      }
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 * i) / 24;
        const speed = Math.random() * 4 + 2.5;
        particles.push({
          type: Math.random() < 0.5 ? 'goldDust' : Math.random() < 0.8 ? 'sparkle' : 'heart',
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 10 + 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.12,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor lerp
      mouseX += (targetMouseX - mouseX) * 0.25;
      mouseY += (targetMouseY - mouseY) * 0.25;

      // Draw subtle glowing custom cursor ring
      ctx.save();
      ctx.translate(mouseX, mouseY);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fadadd';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.018;
        p.rotation += p.vRot;
        p.size *= 0.98;

        if (p.alpha > 0 && p.size > 0.6) {
          if (p.type === 'heart') {
            drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
          } else if (p.type === 'petal') {
            drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
          } else {
            drawSparkle(ctx, p.x, p.y, p.size, p.color, p.alpha);
          }
        }
      }

      particles = particles.filter((p) => p.alpha > 0 && p.size > 0.6);
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

export default HeartCursorTrail;
