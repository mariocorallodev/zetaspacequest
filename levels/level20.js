// levels/level20.js

// Importa il componente animato del sidekick
import AnimatedDog from '../components/AnimatedDog2';

// Esporta un oggetto di configurazione per il Livello 20
export const level20Data = {
  level: 20,

  // --- Componente animato del compagno per questo livello ---
  // QUESTA È LA RIGA DA MODIFICARE PER LA DIMENSIONE DEL CANE ANIMATO!
  // Qui passiamo esplicitamente la prop 'size' al componente AnimatedDog.
  // Ho cambiato size={180} a size={480} (o il valore desiderato per l'animazione).
  sidekickComponent: () => <AnimatedDog size={300} />, // ATTENZIONE: funzione che restituisce il componente JSX

  // --- Dimensione del compagno per questo livello (facoltativo, lo riceve già il componente) ---
  // Questa prop 'sidekickSize' è rilevante solo se App.js renderizza un'immagine statica
  // basata su 'sidekickImage', non se usa 'sidekickComponent'.
  // L'ho impostata a 480 per coerenza, ma non influisce su AnimatedDog.
  sidekickSize: 480,

  // --- Nome del compagno per questo livello ---
  sidekickName: "JASPER",

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

  // --- MODIFICA CORRETTIVA ---
  // Aggiungiamo l'oggetto `levelEffects` per "accendere" il tremolio.
  // Ora App.js leggerà questa configurazione e attiverà l'effetto.
  levelEffects: {
    shake: {
      interval: 480, // Tremolio ogni 480 tick (circa 8 secondi)
      intensity: 20, // Forza del tremolio
    }
  }
};