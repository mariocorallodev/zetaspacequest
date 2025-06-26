// levels/level1.js

// Esporta un oggetto di configurazione per il Livello 1
export const level1Data = {
  level: 1,
  
  // --- NUOVO: Immagine del compagno che appare con il power-up ---
  sidekickImage: require('../assets/img/sk/ragu.png'),

  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 200, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)

    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "RAGU'", // Aggiungi il nome del sidekick qui
  
  // Asset specifici per questo livello
  backgroundImage: require('../assets/bg.jpg'),
  enemyImage: require('../assets/enemy.png'),
  backgroundMusicFile: require('../assets/music2.mp3'),

  // Configurazione della griglia dei nemici
  enemyRows: 3,
  enemyCols: 6,
  enemySpacing: 15,

  // Velocità di movimento dei nemici
  enemyMoveInterval: 90, // Si muovono ogni 30 tick (più basso = più veloce)
};
