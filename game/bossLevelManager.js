import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOSS_WIDTH = 180;
const BOSS_HEIGHT = 180;
const BOSS_START_X = SCREEN_WIDTH / 2 - BOSS_WIDTH / 2;
const BOSS_START_Y = 120;
const BOSS_MAX_HEALTH = 30;

export function createBoss(enemyImage) {
  return {
    x: BOSS_START_X,
    y: BOSS_START_Y,
    width: BOSS_WIDTH,
    height: BOSS_HEIGHT,
    health: BOSS_MAX_HEALTH,
    maxHealth: BOSS_MAX_HEALTH,
    image: enemyImage,
    direction: 1,
    speed: 4,
    isHit: false,
    hitTimer: 0,
    hitAnimPhase: 0,
  };
}

export function updateBoss(boss, screenWidth) {
  // Movimento orizzontale semplice
  boss.x += boss.speed * boss.direction;
  if (boss.x <= 0 || boss.x + boss.width >= screenWidth) {
    boss.direction *= -1;
  }
  if (boss.isHit) {
    boss.hitTimer--;
    boss.hitAnimPhase++;
    if (boss.hitTimer <= 0) {
      boss.isHit = false;
      boss.hitTimer = 0;
      boss.hitAnimPhase = 0;
    }
  }
}

export function checkBossHit(boss, poops) {
  let hit = false;
  poops.forEach((poop) => {
    if (
      poop.x < boss.x + boss.width &&
      poop.x + 20 > boss.x &&
      poop.y < boss.y + boss.height &&
      poop.y + 20 > boss.y
    ) {
      hit = true;
      boss.health -= 1;
      poop.hit = true;
      boss.isHit = true;
      boss.hitTimer = 8; // 8 frame
      boss.hitAnimPhase = 0;
    }
  });
  return hit;
}

// Restituisce valori di animazione per shake/ingrandimento
export function getBossAnim(boss) {
  if (!boss.isHit) return { scale: 1, translateX: 0 };
  // Shake orizzontale e ingrandimento
  const shake = Math.sin(boss.hitAnimPhase * 16) * 16; // shake 
  //Aumenta il numero (es. 12, 16) per far durare di più l'effetto di shake/ingrandimento/flash.
//Diminuisci per un effetto più breve e "secco".
//Il numero 8 controlla quanto il boss si sposta a destra/sinistra.
//Aumenta (es. 16) per uno shake più forte.
//Diminuisci (es. 4) per uno shake più leggero.

  const scale = 2.12 - (boss.hitAnimPhase * 0.015); // parte grande, poi torna normale
  return { scale, translateX: shake };
}
//Il numero 2.12 è la scala iniziale (quanto il boss si ingrandisce subito dopo il colpo).
//2.12 = il boss è più che raddoppiato per un istante!
//1.12 = il boss si ingrandisce solo un po' (12% in più).
//Modifica questo valore per regolare quanto il boss "esplode" visivamente quando viene colpito.
//Il numero 0.015 controlla quanto velocemente il boss torna alla dimensione normale.
//Aumenta (es. 0.03) per un ritorno più veloce.
//Diminuisci (es. 0.008) per un ritorno più lento.

// Inizializza array proiettili
export function initBossProjectiles() {
  return [];
}

// Aggiorna posizione proiettili e rimuovi quelli fuori dallo schermo
export function updateBossProjectiles(projectiles, screenHeight) {
  return projectiles
    .map(p => ({ ...p, y: p.y + p.speed }))
    .filter(p => p.y < screenHeight + p.size);
}

// Spara un nuovo proiettile dal boss
export function bossShoot(boss) {
  return {
    x: boss.x + boss.width / 2 - 12,
    y: boss.y + boss.height - 10,
    size: 24,
    speed: 8,
  };
}