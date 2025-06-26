// levels/level3.js

// Esporta un oggetto di configurazione per il Livello 3
export const level5Data = {
  level: 5,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/vittoria.png'),
  
  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 180, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)


    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "VITTORIA", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/bg.jpg'), // Potrebbe essere background3.png
  enemyImage: require('../assets/lupo.png'), 
  backgroundMusicFile: require('../assets/vittoria.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 7,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 60, // Un valore più ALTO significa nemici più LENTI
};
