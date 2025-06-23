// levels/level3.js

// Esporta un oggetto di configurazione per il Livello 3
export const level6Data = {
  level: 6,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/nina.png'),
  
  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 180, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)

  // Asset specifici per questo livello
  backgroundImage: require('../assets/background2.png'), // Potrebbe essere background3.png
  enemyImage: require('../assets/lupo.png'), 
  backgroundMusicFile: require('../assets/boss.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 9,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 60, // Un valore più ALTO significa nemici più LENTI
};
