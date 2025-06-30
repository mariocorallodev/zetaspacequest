import React from 'react';
import { Image } from 'react-native';

export default function Poops({ poops, poopImage, baseStyles }) {
  return (
    <>
      {poops.map((p, i) => (
        <Image
          key={`poop-${i}`}
          source={poopImage}
          style={[baseStyles.poop, { left: p.x, top: p.y }]}
        />
      ))}
    </>
  );
} 