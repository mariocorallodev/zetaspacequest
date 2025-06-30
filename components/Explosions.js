import React from 'react';
import { Animated } from 'react-native';

export default function Explosions({ explosions, ENEMY_WIDTH, ENEMY_HEIGHT }) {
  return (
    <>
      {explosions.map(exp => (
        <Animated.View
          key={`explosion-${exp.id}`}
          style={{
            position: 'absolute',
            left: exp.x - (exp.width || ENEMY_WIDTH) / 2,
            top: exp.y - (exp.height || ENEMY_HEIGHT) / 2,
            width: exp.width || ENEMY_WIDTH,
            height: exp.height || ENEMY_HEIGHT,
            borderRadius: (exp.width || ENEMY_WIDTH) / 2,
            backgroundColor: 'orange',
            opacity: exp.opacityAnim,
            transform: [{ scale: exp.scaleAnim }],
          }}
        />
      ))}
    </>
  );
}
