// levels/level2.js

// Esporta un oggetto di configurazione per il Livello 2
export const level2Data = {
  level: 2,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/blu.png'),

  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 180, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)
  

    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "BLU", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/bg.jpg'), // Potrebbe essere background3.png
  enemyImage: require('../assets/enemy2.png'), // Potrebbe essere enemy2.png
  backgroundMusicFile: require('../assets/blu.mp3'), // Potrebbe essere music2.mp3

  // Configurazione della griglia dei nemici
  enemyRows: 3,
  enemyCols: 6,
  enemySpacing: 15,

  // Velocità di movimento dei nemici
  enemyMoveInterval: 90, // Si muovono ogni 30 tick (più basso = più veloce)
};
