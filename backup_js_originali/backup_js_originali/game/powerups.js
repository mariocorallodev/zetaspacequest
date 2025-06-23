// fireLogic.js – Logica esterna per gestire lo sparo in base al power-up

// Questa funzione restituisce un array di proiettili da sparare.
// - `dogX`: posizione X attuale del cane (player principale)
// - `isPoweredUp`: indica se il power-up è attivo
// - `screenHeight`: altezza dello schermo, serve per posizionare i proiettili
// - `constants`: oggetto che contiene larghezza cane e proiettile
// - `levelData`: oggetto dati del livello, in futuro può influenzare il tipo di sparo

export function getPoopProjectiles(dogX, isPoweredUp, screenHeight, constants, levelData) {
  const { DOG_WIDTH, POOP_WIDTH, POOP_HEIGHT } = constants;
  const baseY = screenHeight - 180;

  if (!isPoweredUp) {
    // --- Caso standard: un solo proiettile centrale
    return [{
      x: dogX + DOG_WIDTH / 2 - POOP_WIDTH / 2,
      y: baseY,
      dx: 0,
      rotation: 0,
      width: POOP_WIDTH,
      height: POOP_HEIGHT
    }];
  }

  // --- Power-up attivo: spara 3 proiettili (centro, sinistra, destra)
  const offset = 40;
  return [
    {
      x: dogX + DOG_WIDTH / 2 - POOP_WIDTH / 2,
      y: baseY,
      dx: 0,
      rotation: 0,
      width: POOP_WIDTH,
      height: POOP_HEIGHT
    },
    {
      x: dogX + DOG_WIDTH / 2 - POOP_WIDTH / 2 - offset,
      y: baseY,
      dx: 0,
      rotation: 0,
      width: POOP_WIDTH,
      height: POOP_HEIGHT
    },
    {
      x: dogX + DOG_WIDTH / 2 - POOP_WIDTH / 2 + offset,
      y: baseY,
      dx: 0,
      rotation: 0,
      width: POOP_WIDTH,
      height: POOP_HEIGHT
    }
  ];
}
