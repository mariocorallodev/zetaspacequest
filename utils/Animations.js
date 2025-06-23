// utils/Animations.js
// Contiene funzioni per effetti di animazione comuni.

import { Animated } from 'react-native';

/**
 * Avvia un'animazione di tremolio (shake) su un Animated.Value.
 * Utilizzabile per feedback visivi, es. quando il giocatore subisce danni o raccoglie un power-up.
 *
 * @param {Animated.Value} shakeAnimation - L'Animated.Value che controlla la trasformazione (es. translateX).
 * @param {number} distance - La distanza massima del tremolio orizzontale (default 10).
 * @param {number} duration - La durata di ogni singolo "scossone" (default 80ms).
 * @param {number} cycles - Il numero di cicli di tremolio (default 3).
 */
export const startShakeAnimation = (shakeAnimation, distance = 10, duration = 80, cycles = 3) => {
  // Resetta l'animazione al valore iniziale (0) per sicurezza,
  // in caso fosse già in uno stato di tremolio.
  shakeAnimation.setValue(0);

  // Crea una sequenza di animazioni di tremolio:
  // sposta a destra, poi a sinistra, poi torna al centro.
  const shakeSequence = Animated.sequence([
    Animated.timing(shakeAnimation, {
      toValue: distance, // Sposta a destra
      duration: duration,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: -distance, // Sposta a sinistra
      duration: duration * 2, // Durata doppia per andare e tornare un po' più indietro
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: 0, // Torna al centro
      duration: duration,
      useNativeDriver: true,
    }),
  ]);

  // Esegue la sequenza per il numero di cicli specificato.
  // Dopo i cicli, resetta l'animazione a 0 per essere pronta per la prossima volta.
  Animated.loop(shakeSequence, { iterations: cycles }).start(() => {
    shakeAnimation.setValue(0); // Assicura che si fermi al centro
  });
};
