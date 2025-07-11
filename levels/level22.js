// levels/level22.js

// Esporta un oggetto di configurazione per il Livello 22
export const level22Data = {
  level: 22,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/vittoria2.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 140,

  // --- Nome del compagno per questo livello ---
  sidekickName: "VITTO",

  // Asset specifici per questo livello
  backgroundImage: require('../assets/img/bg/sfondo4_v2.png'),
  enemyImage: require('../assets/img/enemy/lv/21_24_chopper.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/21_24.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 5,
  enemyCols: 9,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
};
