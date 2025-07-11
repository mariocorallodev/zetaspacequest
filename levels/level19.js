// levels/level19.js

// Esporta un oggetto di configurazione per il Livello 19
export const level19Data = {
  level: 19,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/edna.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 160,

  // --- Nome del compagno per questo livello ---
  sidekickName: "EDNA",

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
