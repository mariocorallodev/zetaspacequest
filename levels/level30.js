// levels/level30.js

// Importa il componente animato del sidekick
import AnimatedDog from '../components/AnimatedDog3';
import BossEnemy from '../components/BossEnemy';
import BossHealthBar from '../components/BossHealthBar';
import BossProjectiles from '../components/BossProjectiles';
import { createBoss, updateBoss, checkBossHit, getBossAnim, initBossProjectiles, updateBossProjectiles, bossShoot } from '../game/bossLevelManager';

// Esporta un oggetto di configurazione per il Livello 30
export const level30Data = {
  level: 30,
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
  sidekickComponent: () => <AnimatedDog size={300} />, // ATTENZIONE: funzione che restituisce il componente JSX

  // --- Dimensione del compagno per questo livello (facoltativo, lo riceve già il componente) ---
  sidekickSize: 300,

  // --- Nome del compagno per questo livello ---
  sidekickName: ":)",

  // Asset specifici per questo livello
  backgroundImage: require('../assets/background2.png'),
  enemyImage: require('../assets/img/enemy/phon.png'),
  backgroundMusicFile: require('../assets/sounds/levels/30.mp3'),

  difficulty: 2.5, // livello 30

  // --- MODIFICA CORRETTIVA ---
  // Aggiungiamo l'oggetto `levelEffects` per "accendere" il tremolio.
  // Ora App.js leggerà questa configurazione e attiverà l'effetto.
  levelEffects: {
    shake: {
      interval: 480, // Tremolio ogni 480 tick (circa 8 secondi)
      intensity: 40, // Forza del tremolio
    }
  },

  enemyRows: 6,
  enemyCols: 10,
  enemySpacing: 8,
}; 