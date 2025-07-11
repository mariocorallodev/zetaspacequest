// levels/level26.js

// Esporta un oggetto di configurazione per il Livello 26
export const level26Data = {
  level: 26,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/achille.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 180,

  // --- Nome del compagno per questo livello ---
  sidekickName: "ACHI",

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