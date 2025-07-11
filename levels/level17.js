// levels/level17.js

// Esporta un oggetto di configurazione per il Livello 17
export const level17Data = {
  level: 17,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/penny.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 240,

  // --- Nome del compagno per questo livello ---
  sidekickName: "PENNY",

  // Asset specifici per questo livello
  backgroundImage: require('../assets/img/bg/sfondo3.png'),
  enemyImage: require('../assets/img/enemy/lv/16_19_lupo.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/16_19.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 8,
  enemySpacing: 12,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
};
