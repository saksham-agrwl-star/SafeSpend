import { useEffect, useRef } from 'react';

export default function ParticleCanvas({ orbRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles array
    const particles = Array.from({ length: 60 }, (_, i) => ({
      angle: (i / 60) * Math.PI * 2,
      radius: 180 + Math.random() * 80,
      speed: 0.003 + Math.random() * 0.004,
      size: 1 + Math.random() * 2.5,
      opacity: 0.2 + Math.random() * 0.6,
      drift: Math.random() < 0.5 ? 1 : -1,
    }));

    let raf;

    function getOrbCenter() {
      if (orbRef?.current) {
        const rect = orbRef.current.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
      return { x: canvas.width - 220, y: canvas.height - 220 };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const center = getOrbCenter();

      particles.forEach((p) => {
        p.angle += p.speed * p.drift;

        const x = center.x + Math.cos(p.angle) * p.radius;
        const y = center.y + Math.sin(p.angle) * p.radius;

        // Glow gradient
        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        grad.addColorStop(0, `rgba(108, 99, 255, ${p.opacity})`);
        grad.addColorStop(0.5, `rgba(0, 212, 170, ${p.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(108, 99, 255, 0)');

        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 195, 255, ${p.opacity})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [orbRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9,
      }}
    />
  );
}
