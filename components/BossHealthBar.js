import React from 'react';
import { View } from 'react-native';

export default function BossHealthBar({ current, max }) {
  const percent = Math.max(0, Math.min(1, current / max));
  return (
    <View style={{
      position: 'absolute',
      top: 90,
      left: 30,
      right: 30,
      height: 24,
      backgroundColor: '#222',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#fff',
      overflow: 'hidden',
      zIndex: 100,
    }}>
      <View style={{
        width: `${percent * 100}%`,
        height: '100%',
        backgroundColor: percent > 0.3 ? '#e74c3c' : '#f1c40f',
        borderRadius: 12,
      }} />
    </View>
  );
}
