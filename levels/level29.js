// levels/level29.js

// Esporta un oggetto di configurazione per il Livello 29
export const level29Data = {
  level: 29,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/danko.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 220,

  // --- Nome del compagno per questo livello ---
  sidekickName: "DANKO",

  // Asset specifici per questo livello

  enemyImage: require('../assets/img/enemy/lv/26_29_phon.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/26-29.mp3'), 
  backgroundImage: require('../assets/img/bg/sfondo5_v2.png'),
  // Configurazione della griglia più difficile
  enemyRows: 6,
  enemyCols: 10,
  enemySpacing: 8,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
}; 