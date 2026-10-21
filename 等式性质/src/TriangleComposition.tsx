import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, spring, Sequence, Composition } from 'remotion';

interface TriangleProps {
  sideA: number;
  sideB: number;
  sideC: number;
}

const TriangleVisualization: React.FC<TriangleProps> = ({ sideA, sideB, sideC }) => {
  const frame = useCurrentFrame();

  const centerX = 640;
  const centerY = 360;
  const scale = 60;

  const point1 = { x: centerX, y: centerY - sideA * scale };
  const point2 = { x: centerX - sideB * scale * Math.sin(Math.PI / 3), y: centerY + sideB * scale * Math.cos(Math.PI / 3) };
  const point3 = { x: centerX + sideC * scale * Math.sin(Math.PI / 3), y: centerY + sideC * scale * Math.cos(Math.PI / 3) };

  const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '24px', fontFamily: 'Arial, sans-serif' }}>
        <div>三角形边长验证</div>
        <div style={{ fontSize: '18px', marginTop: '10px' }}>
          边 A: {sideA.toFixed(1)} | 边 B: {sideB.toFixed(1)} | 边 C: {sideC.toFixed(1)}
        </div>
      </div>

      <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <line x1={point1.x} y1={point1.y} x2={point2.x} y2={point2.y} stroke="#4a7c7e" strokeWidth="5" opacity={progress} />
        <line x1={point2.x} y1={point2.y} x2={point3.x} y2={point3.y} stroke="#4a7c7e" strokeWidth="5" opacity={progress} />
        <line x1={point3.x} y1={point3.y} x2={point1.x} y2={point1.y} stroke="#4a7c7e" strokeWidth="5" opacity={progress} />

        <circle cx={point1.x} cy={point1.y} r="8" fill="#ff6b6b" opacity={progress} />
        <circle cx={point2.x} cy={point2.y} r="8" fill="#4ecdc4" opacity={progress} />
        <circle cx={point3.x} cy={point3.y} r="8" fill="#45b7d1" opacity={progress} />
      </svg>

      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, color: 'white', fontSize: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '10px', opacity: progress }}>
        <div style={{ marginBottom: '10px' }}>验证结果：</div>
        <div style={{ color: sideA + sideB > sideC ? '#90ee90' : '#ff6b6b' }}>
          边A + 边B = {(sideA + sideB).toFixed(1)} &gt; 边C = {sideC.toFixed(1)} : {sideA + sideB > sideC ? '✓ 成立' : '✗ 不成立'}
        </div>
        <div style={{ color: sideB + sideC > sideA ? '#90ee90' : '#ff6b6b' }}>
          边B + 边C = {(sideB + sideC).toFixed(1)} &gt; 边A = {sideA.toFixed(1)} : {sideB + sideC > sideA ? '✓ 成立' : '✗ 不成立'}
        </div>
        <div style={{ color: sideA + sideC > sideB ? '#90ee90' : '#ff6b6b' }}>
          边A + 边C = {(sideA + sideC).toFixed(1)} &gt; 边B = {sideB.toFixed(1)} : {sideA + sideC > sideB ? '✓ 成立' : '✗ 不成立'}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center', color: '#4a7c7e', fontSize: '36px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', opacity: progress }}>
        三角形任意两边之和大于第三边
      </div>
    </AbsoluteFill>
  );
};

export const triangleCompositionConfig = {
  id: 'TriangleComposition',
  component: TriangleVisualization,
  durationInFrames: 120,
  fps: 30,
  width: 1280,
  height: 720,
  defaultProps: {
    sideA: 3,
    sideB: 4,
    sideC: 5,
  },
};

export const EqualityPropertyVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const ttsUrl =
    process.env.ELEVENLABS_TTS_URL ||
    process.env.ELEVENLABS_TTS_LOCAL ||
    null; // 运行环境中无 TTS 文件时不启用 Audio

  const captionTiming = [
    { start: 0, end: 80, text: 'Step1：A=C，B=D，等量加法，A+B=C+D。' },
    { start: 80, end: 160, text: 'Step2：A=C，B=D，等量减法，A-B=C-D。' },
    { start: 160, end: 240, text: 'Step3：图形对比验证，A/C、B/D 长度相等。' },
  ];

  const subtitle = captionTiming.find((item) => frame >= item.start && frame < item.end)?.text ?? '';

  const introOpacity = interpolate(frame, [0, 15, 30], [0, 1, 1], { extrapolateRight: 'clamp' });

  const animatedX1 = spring({ fps, frame: frame - 15, config: { damping: 20, stiffness: 90 } });
  const animatedX2 = spring({ fps, frame: frame - 95, config: { damping: 20, stiffness: 90 } });

  const pathLine = (
    <svg width='1280' height='120' style={{ position: 'absolute', top: '42%', left: 0 }}>
      <line x1='205' y1='30' x2='550' y2='30' stroke='#38bdf8' strokeWidth='4' strokeDasharray='8 6' />
      <line x1='520' y1='35' x2='810' y2='35' stroke='#facc15' strokeWidth='4' strokeDasharray='8 6' />
      <line x1='270' y1='70' x2='540' y2='70' stroke='#a78bfa' strokeWidth='4' strokeDasharray='8 6' />
      <line x1='510' y1='75' x2='810' y2='75' stroke='#fb7185' strokeWidth='4' strokeDasharray='8 6' />
    </svg>
  );

  const bar = (label: string, percent: number, top: string, color: string) => (
    <div style={{ position: 'absolute', top, left: '50%', transform: 'translateX(-50%)', width: 840, height: 46, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 150, color: '#cbd5e1', fontSize: 24, fontWeight: 700 }}>{label}</div>
      <div style={{ flex: 1, background: '#334155', borderRadius: 12, height: 24 }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: 12 }} />
      </div>
      <div style={{ width: 80, textAlign: 'right', color: '#e2e8f0', fontSize: 24, fontWeight: 700 }}>{percent}%</div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#020c1b', color: '#dbeafe' }}>
      {ttsUrl ? <Audio src={ttsUrl} /> : null}

      <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', fontSize: 62, fontWeight: 900, color: '#7dd3fc', textShadow: '0 0 20px rgba(34, 211, 238, 0.85)', opacity: introOpacity }}>
        等式性质可视化：变量+公式+图形
      </div>

      <Sequence from={0} durationInFrames={80}>
        <div style={{ position: 'absolute', top: '24%', left: '50%', transform: `translateX(calc(-50% + ${interpolate(animatedX1, [0, 1], [120, 0])}px))`, opacity: 1 }}>
          <div style={{ position: 'absolute', left: '24%', top: 0 }}>{bar('A/C', 70, '34%', '#38bdf8')}</div>
          <div style={{ position: 'absolute', left: '24%', top: '46%' }}>{bar('B/D', 70, '52%', '#34d399')}</div>
          {pathLine}
          <div style={{ position: 'absolute', left: '24%', top: 0 }}>{bar('A+B', 75, '34%', '#facc15')}</div>
          <div style={{ position: 'absolute', left: '24%', top: '46%' }}>{bar('C+D', 75, '52%', '#f472b6')}</div>
        </div>
      </Sequence>

      <Sequence from={80} durationInFrames={80}>
        <div style={{ position: 'absolute', top: '24%', left: '50%', transform: `translateX(calc(-50% + ${interpolate(animatedX2, [0, 1], [120, 0])}px))`, opacity: 1 }}>
          {pathLine}
          {bar('A-B', 60, '34%', '#a78bfa')}
          {bar('C-D', 60, '52%', '#fb7185')}
        </div>
      </Sequence>

      <Sequence from={160} durationInFrames={80}>
        <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translateX(-50%)', width: 900, textAlign: 'center', color: '#bef264', fontSize: 48, fontWeight: 900 }}>
          结论：A=C、B=D → A+B=C+D，A-B=C-D（等量加减保持等价）
        </div>
      </Sequence>

      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: '90%', textAlign: 'center', color: '#cbd5e1', fontSize: 24 }}>{subtitle}</div>
    </AbsoluteFill>
  );
};

export const TriangleComposition: React.FC = () => {
  return <TriangleVisualization sideA={3} sideB={4} sideC={5} />;
};