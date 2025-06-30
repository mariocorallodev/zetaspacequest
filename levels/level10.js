// levels/level11.js

// Importa il componente animato del sidekick
import AnimatedDog from '../components/AnimatedDog2';
import BossEnemy from '../components/BossEnemy';
import BossHealthBar from '../components/BossHealthBar';
import BossProjectiles from '../components/BossProjectiles';
import { createBoss, updateBoss, checkBossHit, getBossAnim, initBossProjectiles, updateBossProjectiles, bossShoot } from '../game/bossLevelManager';

// Esporta un oggetto di configurazione per il Livello 10
export const level10Data = {
  level: 10,
  isBossLevel: true,
  bossInit: (enemyImage) => createBoss(enemyImage),
  bossUpdate: updateBoss,
  bossCheckHit: checkBossHit,
  bossRender: (boss) => {
    const anim = getBossAnim(boss);
    return <BossEnemy {...boss} scale={anim.scale} translateX={anim.translateX} isHit={boss.isHit} />;
  }, // mostra il boss con animazioni
  bossHealthBar: (boss) => <BossHealthBar current={boss.health} max={boss.maxHealth} />, // mostra la barra vita
  bossProjectilesInit: initBossProjectiles,
  bossProjectilesUpdate: updateBossProjectiles,
  bossShoot: bossShoot,
  bossProjectilesRender: (projectiles) => <BossProjectiles projectiles={projectiles} />, // mostra i proiettili

  // --- Componente animato del compagno per questo livello ---
  // QUESTA È LA RIGA DA MODIFICARE PER LA DIMENSIONE DEL CANE ANIMATO!
  // Qui passiamo esplicitamente la prop 'size' al componente AnimatedDog.
  // Ho cambiato size={180} a size={480} (o il valore desiderato per l'animazione).
  sidekickComponent: () => <AnimatedDog size={300} />, // ATTENZIONE: funzione che restituisce il componente JSX

  // --- Dimensione del compagno per questo livello (facoltativo, lo riceve già il componente) ---
  // Questa prop 'sidekickSize' è rilevante solo se App.js renderizza un'immagine statica
  // basata su 'sidekickImage', non se usa 'sidekickComponent'.
  // L'ho impostata a 480 per coerenza, ma non influisce su AnimatedDog.
  sidekickSize: 280,

  // --- Nome del compagno per questo livello ---
  sidekickName: "JASPER",

  // Asset specifici per questo livello
  backgroundImage: require('../assets/background2.png'),
  enemyImage: require('../assets/img/enemy/skate.png'),
  backgroundMusicFile: require('../assets/boss3.mp3'),

 

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