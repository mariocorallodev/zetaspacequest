import React from 'react';
import { Image, View } from 'react-native';

export default function BossEnemy({ x, y, width, height, image, isHit, scale = 1, translateX = 0 }) {
  return (
    <View style={{
      position: 'absolute',
      left: x + translateX,
      top: y,
      width,
      height,
      zIndex: 50,
      transform: [{ scale }],
    }}>
      <Image
        source={image}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}
