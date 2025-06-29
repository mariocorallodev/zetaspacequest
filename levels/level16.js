// levels/level16.js

// Esporta un oggetto di configurazione per il Livello 16
export const level16Data = {
  level: 16,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets//img/sk/dior.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 180,

  // --- Nome del compagno per questo livello ---
  sidekickName: "DIOR",

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
