import React from 'react';
import { Image } from 'react-native';

const projectileImg = require('../assets/boss_projectile.png');

export default function BossProjectiles({ projectiles }) {
  return (
    <>
      {projectiles.map((p, i) => (
        <Image
          key={i}
          source={projectileImg}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            zIndex: 30,
            resizeMode: 'contain',
            opacity: 0.95,
          }}
        />
      ))}
    </>
  );
} 