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
  backgroundMusicFile: require('../assets/boss3.mp3'), 
  backgroundImage: require('../assets/background2.png'),
  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 9,
  enemySpacing: 0,

  // Nemici con una velocità diversa
  enemyMoveInterval: 200,

  
}; 