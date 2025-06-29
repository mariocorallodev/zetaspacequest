// levels/level8.js

// Esporta un oggetto di configurazione per il Livello 3
export const level9Data = {
  level: 9,

  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/hook.png'),
  
  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 220, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)


    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "HOOK", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/bg.jpg'), // Potrebbe essere background3.png
  enemyImage: require('../assets/enemy.png'), 
  backgroundMusicFile: require('../assets/hook.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 9,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 60, // Un valore più ALTO significa nemici più LENTI
};
