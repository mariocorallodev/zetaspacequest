// levels/level3.js

// Esporta un oggetto di configurazione per il Livello 3
export const level7Data = {
  level: 7,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/tea.png'),
  
  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 200, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)


    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "TEA", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/background2.png'), // Potrebbe essere background3.png
  enemyImage: require('../assets/dog.png'), 
  backgroundMusicFile: require('../assets/boss.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 9,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 60, // Un valore più ALTO significa nemici più LENTI
};
