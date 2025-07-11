// AnimatedDog.js – Componente pulito, versione che rispetta la size effettiva visibile

import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';

const frames = [
  require('../assets/img/group/group-1.png'),
  require('../assets/img/group/group-2.png'),
  require('../assets/img/group/group-3.png'),
  require('../assets/img/group/group-4.png'),
  require('../assets/img/group/group-5.png'),
  
  
];

export default function AnimatedGroup({ size = 380 }) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
    }, 111);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{
      width: '100%',
      height: 'auto',
      alignSelf: 'center',
      overflow: 'visible',
      padding: 0,
      margin: 0,
    }}>
      <Image
        source={frames[frameIndex]}
        style={{
          width: size,
          height: undefined,
          aspectRatio: 2.5, // Adatta l'aspect ratio se necessario, oppure rimuovi se vuoi che sia libero
          resizeMode: 'contain',
          position: 'relative',
          margin: 0,
          padding: 0,
          alignSelf: 'center',
        }}
      />
    </View>
  );
}