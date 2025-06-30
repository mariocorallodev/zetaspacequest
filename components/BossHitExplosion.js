import React, { useMemo } from 'react';
import { View } from 'react-native';

const COLORS = ['#fff700', '#fff', '#ffb300', '#ff4d00', '#ffe082', '#aeea00', '#00e5ff', '#ffd600'];

// Funzione per generare punti di una stella SVG-like
function getStarPoints(size, spikes = 5, innerRatio = 0.5) {
  const points = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < 2 * spikes; i++) {
    const r = i % 2 === 0 ? size / 2 : (size / 2) * innerRatio;
    const angle = i * step - Math.PI / 2;
    points.push({
      x: size / 2 + Math.cos(angle) * r,
      y: size / 2 + Math.sin(angle) * r,
    });
  }
  return points;
}

export default function BossHitExplosion({ width, height }) {
  // Genera particelle solo una volta per ogni render
  const particles = useMemo(() => {
    const arr = [];
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < 14; i++) {
      const angle = (2 * Math.PI * i) / 14;
      const distance = 40 + Math.random() * 30;
      const size = 18 + Math.random() * 10;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      arr.push({
        left: centerX + Math.cos(angle) * distance - size / 2,
        top: centerY + Math.sin(angle) * distance - size / 2,
        size,
        color,
        opacity: 0.85 + Math.random() * 0.15,
        rotation: Math.random() * 360,
      });
    }
    return arr;
  }, [width, height]);

  // Disegna una stella usando solo View (no SVG)
  function Star({ size, color, opacity, rotation }) {
    const points = getStarPoints(size, 5, 0.45);
    // Approssima la stella con 10 triangolini
    return (
      <View
        style={{
          width: size,
          height: size,
          position: 'absolute',
          opacity,
          transform: [{ rotate: `${rotation}deg` }],
        }}
      >
        {points.map((p, i) => {
          if (i === 0) return null;
          // Ogni triangolo va dal centro a due punti consecutivi
          const prev = points[i - 1];
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: size / 2,
                top: size / 2,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderLeftWidth: Math.abs(p.x - size / 2),
                borderRightWidth: Math.abs(prev.x - size / 2),
                borderBottomWidth: Math.abs(p.y - size / 2),
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: color,
                borderTopWidth: 0,
                borderTopColor: 'transparent',
                opacity: 0.9,
                transform: [{ rotate: `${(i * 360) / 10}deg` }],
              }}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={{ position: 'absolute', left: 0, top: 0, width, height, pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <Star key={i} size={p.size} color={p.color} opacity={p.opacity} rotation={p.rotation} style={{ left: p.left, top: p.top }} />
      ))}
    </View>
  );
}
