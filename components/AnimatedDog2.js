// AnimatedDog.js – Componente pulito, versione che rispetta la size effettiva visibile

import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';

const frames = [
  require('../assets/img/jasper/Jasper-1.png'),
  require('../assets/img/jasper/Jasper-2.png'),
  require('../assets/img/jasper/Jasper-3.png'),
  require('../assets/img/jasper/Jasper-4.png'),
  require('../assets/img/jasper/Jasper-5.png'),
  require('../assets/img/jasper/Jasper-6.png'),
  require('../assets/img/jasper/Jasper-7.png'),
  require('../assets/img/jasper/Jasper-8.png'),
  require('../assets/img/jasper/Jasper-9.png'),
];

export default function AnimatedDog({ size = 220 }) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
    }, 111);
    return () => clearInterval(interval);
  }, []);

  return (
    // Il View contenitore usa la prop 'size' per impostare la sua larghezza e altezza.
    // I bordi e gli sfondi di debug sono stati rimossi.
    <View style={{
      width: size,
      height: size,
      overflow: 'visible', // Mantenuto se vuoi che il contenuto possa eventualmente uscire dai bordi del View
    }}>
      <Image
        source={frames[frameIndex]}
        // L'Image interna si espande per riempire il 100% del View genitore.
        // I bordi e gli sfondi di debug sono stati rimossi anche qui.
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
          position: 'relative',
        }}
      />
    </View>
  );
}