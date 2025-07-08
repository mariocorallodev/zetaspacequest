// utils/gameModes.js

// Modalità di gioco disponibili
export const GAME_MODES = [
  { key: 'ZEN', label: 'Zen', multiplier: 1 },
  { key: 'NORMAL', label: 'Normal', multiplier: 2 },
  { key: 'ADVANCED', label: 'Advanced', multiplier: 3 },
  { key: 'PANIC', label: 'Panic', multiplier: 4 },
];

// Restituisce il moltiplicatore dato il nome della modalità
export function getModeMultiplier(modeKey) {
  const mode = GAME_MODES.find(m => m.key === modeKey);
  return mode ? mode.multiplier : 1;
}

// Applica il moltiplicatore solo alle righe dei nemici (enemyRows) se non è un boss
export function applyGameModeToLevel(levelData, modeKey) {
  if (levelData.isBossLevel) return levelData;
  const multiplier = getModeMultiplier(modeKey);
  return {
    ...levelData,
    enemyRows: Math.max(1, Math.round(levelData.enemyRows * multiplier)),
  };
} 