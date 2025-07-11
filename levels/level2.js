// levels/level2.js

// Esporta un oggetto di configurazione per il Livello 2
export const level2Data = {
  level: 2,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/blu.png'),

  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 180, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)

  // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "BLU", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/bg.jpg'), // Potrebbe essere background3.png
  enemyImage: require('../assets/img/enemy/lv/1_4_ambulance.png'), // Potrebbe essere enemy2.png
  backgroundMusicFile: require('../assets/sounds/levels/1_4.mp3'),

  // Configurazione della griglia dei nemici
  enemyRows: 1,
  enemyCols: 5,
  enemySpacing: 20,

  // Velocità di movimento dei nemici
  enemyMoveInterval: 90, // Si muovono ogni 30 tick (più basso = più veloce)
};
