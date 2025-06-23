// levels/level2.js

// Esporta un oggetto di configurazione per il Livello 2
export const level2Data = {
  level: 2,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/blu.png'),

  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 180, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)
  
  // Asset specifici per questo livello
  backgroundImage: require('../assets/background2.png'), // Potrebbe essere background3.png
  enemyImage: require('../assets/enemy2.png'), // Potrebbe essere enemy2.png
  backgroundMusicFile: require('../assets/music2.mp3'), // Potrebbe essere music2.mp3

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 7,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 40, // Un valore più ALTO significa nemici più LENTI
};
