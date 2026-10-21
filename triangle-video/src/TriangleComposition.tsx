import React from 'react';
import { Composition, AbsoluteFill, useCurrentFrame, interpolate, Line } from 'remotion';

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

  // 三角形顶点坐标
  const point1 = { x: centerX, y: centerY - sideA * scale };
  const point2 = { x: centerX - sideB * scale * Math.sin(Math.PI / 3), y: centerY + sideB * scale * Math.cos(Math.PI / 3) };
  const point3 = { x: centerX + sideC * scale * Math.sin(Math.PI / 3), y: centerY + sideC * scale * Math.cos(Math.PI / 3) };

  // 动画进度
  const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  // 计算边长
  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const drawnSideA = calculateDistance(point2, point3) / scale;
  const drawnSideB = calculateDistance(point1, point3) / scale;
  const drawnSideC = calculateDistance(point1, point2) / scale;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '24px', fontFamily: 'Arial, sans-serif' }}>
        <div>三角形边长验证</div>
        <div style={{ fontSize: '18px', marginTop: '10px' }}>
          边 A: {sideA.toFixed(1)} | 边 B: {sideB.toFixed(1)} | 边 C: {sideC.toFixed(1)}
        </div>
      </div>

      {/* 绘制三角形 */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {/* 三角形边 */}
        <Line
          from={{ x: point1.x, y: point1.y }}
          to={{ x: point2.x, y: point2.y }}
          stroke="#4a7c7e"
          strokeWidth={5}
          style={{ opacity: progress }}
        />
        <Line
          from={{ x: point2.x, y: point2.y }}
          to={{ x: point3.x, y: point3.y }}
          stroke="#4a7c7e"
          strokeWidth={5}
          style={{ opacity: progress }}
        />
        <Line
          from={{ x: point3.x, y: point3.y }}
          to={{ x: point1.x, y: point1.y }}
          stroke="#4a7c7e"
          strokeWidth={5}
          style={{ opacity: progress }}
        />

        {/* 顶点标记 */}
        <circle cx={point1.x} cy={point1.y} r="8" fill="#ff6b6b" style={{ opacity: progress }} />
        <circle cx={point2.x} cy={point2.y} r="8" fill="#4ecdc4" style={{ opacity: progress }} />
        <circle cx={point3.x} cy={point3.y} r="8" fill="#45b7d1" style={{ opacity: progress }} />
      </svg>

      {/* 显示计算结果 */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        color: 'white',
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '20px',
        borderRadius: '10px',
        opacity: progress
      }}>
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

      {/* 标题动画 */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#4a7c7e',
        fontSize: '36px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        opacity: interpolate(frame, [0, 30], [0, 1])
      }}>
        三角形任意两边之和大于第三边
      </div>
    </AbsoluteFill>
  );
};

// 导出配置对象
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
    sideC: 5
  }
};

// 新：等式性质展示组件
export const EqualityPropertyVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 15, 30], [0, 1, 1], { extrapolateRight: 'clamp' });
  const line1Opacity = interpolate(frame, [20, 40, 80], [0, 1, 1], { extrapolateRight: 'clamp' });
  const line2Opacity = interpolate(frame, [80, 100, 140], [0, 1, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 30], [40, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#001e3c', color: '#ffffff' }}>
      <div
        style={{
          position: 'absolute',
          top: '16%',
          left: '50%',
          transform: `translate(-50%, ${titleY}px)`,
          fontSize: 72,
          fontWeight: 'bold',
          textAlign: 'center',
          opacity: titleOpacity,
          letterSpacing: 4,
        }}
      >
        等式性质
      </div>

      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 52,
          fontWeight: 600,
          textAlign: 'center',
          opacity: line1Opacity,
          color: '#7dd3fc',
          lineHeight: 1.4,
        }}
      >
        等量加等量
        <br />
        和相等
      </div>

      <div
        style={{
          position: 'absolute',
          top: '58%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 52,
          fontWeight: 600,
          textAlign: 'center',
          opacity: line2Opacity,
          color: '#fde047',
          lineHeight: 1.4,
        }}
      >
        等量减等量
        <br />
        差相等
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 24,
          color: '#94a3b8',
          textAlign: 'center',
        }}
      >
        例：
        5 + 3 = 8，2 + 6 = 8；
        9 - 4 = 5，7 - 2 = 5
      </div>
    </AbsoluteFill>
  );
};

// 导出三角形组件
export const TriangleComposition: React.FC = () => {
  return <TriangleVisualization sideA={3} sideB={4} sideC={5} />;
};