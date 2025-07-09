// levels/level27.js

// Esporta un oggetto di configurazione per il Livello 27
export const level27Data = {
  level: 27,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets//img/sk/nessa.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 200,

  // --- Nome del compagno per questo livello ---
  sidekickName: "NESSA",

  // Asset specifici per questo livello

  enemyImage: require('../assets/lupo.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/26-29.mp3'), 
  backgroundImage: require('../assets/background2.png'),
  // Configurazione della griglia più difficile
  enemyRows: 6,
  enemyCols: 10,
  enemySpacing: 8,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
}; 