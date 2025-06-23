// levels/level3_boss.js

// Esporta un oggetto di configurazione per un livello di tipo BOSS
export const level3BossData = {
  level: 3,
  type: 'boss', // Nuovo tipo per distinguirlo dai livelli normali

  // Asset specifici per questo livello
  backgroundImage: require('../assets/background2.png'), // Potresti volere uno sfondo epico!
  enemyImage: require('../assets/lupo.png'),       // Immagine del boss (dovrebbe essere più grande)
  backgroundMusicFile: require('../assets/boss.mp3'), // Una musica da boss!

  // Parametri specifici del boss
  boss: {
    health: 20, // Il boss deve essere colpito 20 volte per essere sconfitto
    width: 400, // Un boss più grande
    height: 200,
    x: 100, // Posizione iniziale
    y: 50,
  },
  
  // I parametri della griglia non sono necessari qui, ma li lasciamo per coerenza
  enemyRows: 0,
  enemyCols: 0,
  enemySpacing: 0,
  enemyMoveInterval: 30, // Il boss potrebbe muoversi più lentamente
};
