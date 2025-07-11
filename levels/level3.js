// levels/level3.js

// Esporta un oggetto di configurazione per il Livello 3
export const level3Data = {
  level: 3,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/panda.png'),
  
  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 140, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)


    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "PANDA", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/bg.jpg'), // Potrebbe essere background3.png
  enemyImage: require('../assets/img/enemy/lv/1_4_ambulance.png'), 
  backgroundMusicFile: require('../assets/sounds/levels/1_4.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 1,
  enemyCols: 5,
  enemySpacing: 20,

  // Nemici con una velocità diversa
  enemyMoveInterval: 60, // Un valore più ALTO significa nemici più LENTI
};
