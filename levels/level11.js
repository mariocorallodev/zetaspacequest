// levels/level9.js

// Esporta un oggetto di configurazione per il Livello 3
export const level11Data = {
  level: 11,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/olimpia.png'),
  
  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 250, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)


    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "OLIMPIA", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/img/bg/sfondo2.png'), // Potrebbe essere background3.png
  enemyImage: require('../assets/img/enemy/lv/11_14_fire.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/11_14.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 3,
  enemyCols: 7,
  enemySpacing: 15,

  // Nemici con una velocità diversa
  enemyMoveInterval: 60, // Un valore più ALTO significa nemici più LENTI

  
};
