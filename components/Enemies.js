import React from 'react';
import { Image } from 'react-native';

export default function Enemies({ enemies, enemyImage, baseStyles, ENEMY_WIDTH, ENEMY_HEIGHT }) {
  return (
    <>
      {enemies.map((e) => (
        <Image
          key={e.id}
          source={enemyImage}
          style={[
            { width: e.width || ENEMY_WIDTH, height: e.height || ENEMY_HEIGHT },
            baseStyles.enemy,
            { left: e.x, top: e.y, opacity: e.isExploding ? 0 : 1 }
          ]}
        />
      ))}
    </>
  );
}
