// PowerUpManager.js - Gestisce la logica dei power-up e l'effetto di sparo

import { Dimensions } from 'react-native';

// Costanti di gioco necessarie per calcolare le posizioni dei proiettili
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DOG_WIDTH = 80;
const POOP_WIDTH = 20;
const POOP_HEIGHT = 20;

/**
 * Gestisce la logica di sparo quando il power-up è attivo.
 * Se il power-up è attivo (isPoweredUp è true), il giocatore sparerà 3 proiettili.
 * Altrimenti, sparerà un solo proiettile.
 *
 * @param {Array} poopRef - Il riferimento all'array dei proiettili correnti.
 * @param {number} currentDogX - La posizione X corrente del giocatore.
 * @param {boolean} isPoweredUp - Indica se il power-up è attivo.
 * @param {object} levelData - I dati del livello attuale (per la posizione del sidekick se necessario).
 */
export const handlePoweredUpFire = (poopRef, currentDogX, isPoweredUp, levelData) => {
  // DEBUG: Registra l'ingresso nella funzione e lo stato di isPoweredUp
  console.log("PowerUpManager.js - handlePoweredUpFire chiamato. isPoweredUp:", isPoweredUp);

  // Il giocatore principale (zeta2) spara sempre un proiettile
  poopRef.current.push({
    x: currentDogX + DOG_WIDTH / 2 - POOP_WIDTH / 2,
    y: SCREEN_HEIGHT - 180,
    dx: 0, // Nessuna deviazione per il proiettile centrale
    rotation: 0,
    width: POOP_WIDTH,
    height: POOP_HEIGHT
  });
  console.log("PowerUpManager.js - Aggiunto proiettile centrale."); // DEBUG

  // Se il power-up è attivo, spara ulteriori proiettili
  if (isPoweredUp) {
    console.log("PowerUpManager.js - Power-up attivo, aggiungo 2 proiettili extra."); // DEBUG
    // Sposta il primo proiettile a sinistra del centro
    poopRef.current.push({
      x: currentDogX + DOG_WIDTH / 2 - POOP_WIDTH * 1.5, // Leggermente a sinistra
      y: SCREEN_HEIGHT - 180,
      dx: -1, // Piccola deviazione a sinistra
      rotation: -10,
      width: POOP_WIDTH,
      height: POOP_HEIGHT
    });

    // Sposta il terzo proiettile a destra del centro
    poopRef.current.push({
      x: currentDogX + DOG_WIDTH / 2 + POOP_WIDTH * 0.5, // Leggermente a destra
      y: SCREEN_HEIGHT - 180,
      dx: 1, // Piccola deviazione a destra
      rotation: 10,
      width: POOP_WIDTH,
      height: POOP_HEIGHT
    });
  }
};
