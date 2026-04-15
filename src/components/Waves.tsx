import { useEffect, useRef } from 'react';

type WavesProps = {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
};

export default function Waves({
  lineColor = '#1d4ed8',
  backgroundColor = 'transparent',
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 24,
  waveAmpY = 16,
  xGap = 26,
  yGap = 32,
}: WavesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frame += 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.4;

      for (let y = 0; y <= h + yGap; y += yGap) {
        ctx.beginPath();
        for (let x = 0; x <= w + xGap; x += xGap) {
          const nx = x / Math.max(w, 1);
          const ny = y / Math.max(h, 1);
          const ox = Math.sin(frame * waveSpeedX + ny * Math.PI * 8) * waveAmpX;
          const oy = Math.cos(frame * waveSpeedY + nx * Math.PI * 10) * waveAmpY;
          const px = x + ox * 0.08;
          const py = y + oy * 0.12;
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [backgroundColor, lineColor, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, xGap, yGap]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
