// levels/level3.js

// Esporta un oggetto di configurazione per il Livello 3
export const level6Data = {
  level: 6,
  
  // --- NUOVO: Immagine del compagno per questo livello ---
  sidekickImage: require('../assets/img/sk/nina.png'),
  
  // --- NUOVO: Dimensione del compagno per questo livello ---
  sidekickSize: 230, // Puoi aumentare o ridurre la dimensione del compagno (es. 40, 60, 100)


    // --- NUOVO: Nome del compagno per questo livello ---
  sidekickName: "NINA", // Aggiungi il nome del sidekick qui

  // Asset specifici per questo livello
  backgroundImage: require('../assets/bg.jpg'), // Potrebbe essere background3.png
  enemyImage: require('../assets/lupo.png'), 
  backgroundMusicFile: require('../assets/boss6.mp3'), 

  // Configurazione della griglia più difficile
  enemyRows: 4,
  enemyCols: 9,
  enemySpacing: 10,

  // Nemici con una velocità diversa
  enemyMoveInterval: 60, // Un valore più ALTO significa nemici più LENTI

  // --- MODIFICA CORRETTIVA ---
  // Aggiungiamo l'oggetto `levelEffects` per "accendere" il tremolio.
  // Ora App.js leggerà questa configurazione e attiverà l'effetto.
  levelEffects: {
    shake: {
      interval: 480, // Tremolio ogni 480 tick (circa 8 secondi)
      intensity: 20,  // Forza del tremolio
    }
  }
};
