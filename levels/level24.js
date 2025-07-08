// levels/level24.js

// Esporta un oggetto di configurazione per il Livello 24
export const level24Data = {
  level: 24,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets//img/sk/palu.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 200,

  // --- Nome del compagno per questo livello ---
  sidekickName: "PALU",

  // Asset specifici per questo livello

  enemyImage: require('../assets/lupo.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/21_24.mp3'), 
  backgroundImage: require('../assets/background2.png'),
  // Configurazione della griglia più difficile
  enemyRows: 5,
  enemyCols: 9,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
};
