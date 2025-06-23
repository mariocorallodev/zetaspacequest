// utils/bossShakeAnimation.js
// Questo è il nostro "specialista" dell'effetto tremolio.
// È un "Custom Hook" di React.

import { useEffect, useRef } from 'react';
import { startShakeAnimation } from './Animations'; // Usiamo la stessa animazione che già esiste!

/**
 * Un hook personalizzato che gestisce gli effetti speciali di un livello.
 * @param {object} levelData - I dati del livello attuale.
 * @param {Animated.Value} shakeAnimation - Il valore animato da modificare per il tremolio.
 */
export function useLevelEffects(levelData, shakeAnimation) {
  // Usiamo un ref per il contatore, così non causa ri-renderizzazioni inutili.
  const effectCounters = useRef({});

  // Questo useEffect si attiva solo quando cambia il livello.
  useEffect(() => {
    // Resetta i contatori ogni volta che inizia un nuovo livello.
    effectCounters.current = {};
  }, [levelData]);


  // Questa funzione verrà chiamata ad ogni tick del game loop.
  const updateEffects = () => {
    // Se il livello non ha effetti speciali definiti, non fare nulla.
    if (!levelData.levelEffects) {
      return;
    }

    // Controlla se c'è un effetto "shake" definito per questo livello.
    const shakeEffect = levelData.levelEffects.shake;
    if (shakeEffect) {
      // Inizializza il contatore per l'effetto shake se non esiste.
      if (effectCounters.current.shake === undefined) {
        effectCounters.current.shake = 0;
      }

      // Incrementa il contatore e controlla se è ora di attivare l'effetto.
      effectCounters.current.shake++;
      if (effectCounters.current.shake >= shakeEffect.interval) {
        effectCounters.current.shake = 0; // Resetta il contatore
        startShakeAnimation(shakeAnimation, shakeEffect.intensity); // Avvia l'animazione!
      }
    }

    // --- Futuro: Puoi aggiungere qui altri effetti ---
    // const flashEffect = levelData.levelEffects.flash;
    // if (flashEffect) { ... }
  };

  // L'hook restituisce la funzione di aggiornamento, che verrà chiamata dal game loop.
  return updateEffects;
}
