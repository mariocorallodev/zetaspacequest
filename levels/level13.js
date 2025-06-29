// levels/level12.js

// Esporta un oggetto di configurazione per il Livello 13
export const level13Data = {
  level: 13,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets//img/sk/borlotto.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 180,

  // --- Nome del compagno per questo livello ---
  sidekickName: "BORLOTTO",

  // Asset specifici per questo livello
  backgroundImage: require('../assets/background2.png'),
  enemyImage: require('../assets/lupo.png'), 
  backgroundMusicFile: require('../assets/boss3.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 9,
  enemySpacing: 0,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
};
