// levels/level12.js

// Esporta un oggetto di configurazione per il Livello 14
export const level14Data = {
  level: 14,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/borlotto.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 180,

  // --- Nome del compagno per questo livello ---
  sidekickName: "BORLOTTO",

  // Asset specifici per questo livello
  backgroundImage: require('../assets/img/bg/sfondo2.png'),
  enemyImage: require('../assets/img/enemy/lv/11_14_fire.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/11_14.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 3,
  enemyCols: 7,
  enemySpacing: 15,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
};
