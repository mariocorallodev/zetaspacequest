// levels/level21.js

// Esporta un oggetto di configurazione per il Livello 21
export const level21Data = {
  level: 21,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/lily.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 220,

  // --- Nome del compagno per questo livello ---
  sidekickName: "LILY",

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
