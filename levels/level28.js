// levels/level28.js

// Esporta un oggetto di configurazione per il Livello 28
export const level28Data = {
  level: 28,

  // --- Immagine del compagno per questo livello ---
  sidekickImage: require('../assets//img/sk/palu.png'),
  
  // --- Dimensione del compagno per questo livello ---
  sidekickSize: 200,

  // --- Nome del compagno per questo livello ---
  sidekickName: "PALU 28",

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