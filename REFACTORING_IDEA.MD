// App.js – Con logica di navigazione e leaderboard corretta

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text, Animated, SafeAreaView, PanResponder } from 'react-native';
import { GameLoop } from 'react-native-game-engine';
import { Audio } from 'expo-av';
import baseStyles, {
  SIDEKICK_NAME_FADE_IN_DURATION,
  SIDEKICK_NAME_HOLD_DURATION,
  SIDEKICK_NAME_FADE_OUT_DURATION,
  SIDEKICK_NAME_INITIAL_SCALE,
  SIDEKICK_NAME_FINAL_SCALE,
  SIDEKICK_NAME_Y_OFFSET,
  SIDEKICK_NAME_FONT_SIZE
} from './styles/GameStyle';
import IntroScreen from './screens/IntroScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

// --- GESTIONE LIVELLI ---
import { level1Data } from './levels/level1';
import { level2Data } from './levels/level2';
import { level3Data } from './levels/level3';
import { level4Data } from './levels/level4';
import { level5Data } from './levels/level5';
import { level6Data } from './levels/level6';
import { level7Data } from './levels/level7';
import { level8Data } from './levels/level8';
import { level9Data } from './levels/level9';
import { level10Data } from './levels/level10';
import { level11Data } from './levels/level11';
import { level12Data } from './levels/level12';
import { level13Data } from './levels/level13';
import { level14Data } from './levels/level14';
import { level15Data } from './levels/level15';
import { level16Data } = require('./levels/level16');
import { level17Data } = require('./levels/level17');
import { level18Data } = require('./levels/level18');
import { level19Data } = require('./levels/level19');
import { level20Data } = require('./levels/level20');
import { level21Data } = require('./levels/level21');
import { level22Data } = require('./levels/level22');
import { level23Data } = require('./levels/level23');
import { level24Data } = require('./levels/level24');
import { level25Data } = require('./levels/level25');
// --- Importa la funzione di gestione dello sparo potenziato ---
import { handlePoweredUpFire } from './PowerUpManager';
// --- Importa la funzione di animazione del tremolio ---
import { startShakeAnimation } from './utils/Animations';
import { useLevelEffects } from './utils/bossShakeAnimation';

const allLevels = [level1Data, level2Data, level3Data, level4Data, level5Data, level6Data, level7Data, level8Data, level9Data, level10Data, level11Data, level12Data, level13Data, level14Data, level15Data, level16Data, level17Data, level18Data, level19Data, level20Data, level21Data, level22Data, level23Data, level24Data, level25Data];
const START_LEVEL = 3;

// =================================================================
// Refactoring Priority: Ref0 - Costanti Globali
// Azione: Spostare tutte queste costanti in un file separato (es. 'constants/GameConstants.js')
// Motivazione: Rendono il codice più leggibile, centralizzano i valori e evitano duplicazioni.
// Dipendenza: Nessuna, è un passo iniziale e sicuro.
// =================================================================
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DOG_WIDTH = 80;
const DOG_HEIGHT = 80;
const POOP_WIDTH = 20;
const POOP_HEIGHT = 20;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const INITIAL_LIVES = 3;
const FIRE_COOLDOWN = 250;
const ENEMY_MOVE_SPEED = 10;
const ENEMY_VERTICAL_MOVE = ENEMY_HEIGHT / 2;
const POWERUP_SIZE = 50;

// --- COSTANTI PER LA SCHERMATA DI PAUSA ---
const PAUSE_TITLE_FONT_SIZE = 40;
const PAUSE_BUTTON_FONT_SIZE = 18;
const PAUSE_BUTTON_PADDING_V = 15;
const PAUSE_BUTTON_PADDING_H = 30;

// --- ASSET GENERICI ---
// Questi asset possono essere importati direttamente nei componenti che li usano,
// o se sono veramente "globali" e usati da tanti, lasciati qui o in un file di asset centralizzato.
const dogImage = require('./assets/zeta2.png');
const poopImage = require('./assets/poop.png');
const poopSound = require('./assets/poop.mp3');
const fartSound = require('./assets/fart.mp3');
const explosionSound = require('./assets/explosion.mp3');
const gameOverSound = require('./assets/gameover.mp3');
const lifeSound = require('./assets/life.mp3');
const powerUpImage = require('./assets/power.png');
const powerUpSoundFile = require('./assets/powerup.mp3');

export default function App() {
  // =================================================================
  // Refactoring Priority: Ref1 - Stati del Gioco
  // Azione: Spostare tutti questi stati e i loro setter in un custom hook (es. 'hooks/useGameState.js' o 'hooks/useGameLogic.js').
  // Motivazione: Centralizza la gestione dello stato del gioco, rendendo App.js un componente più "presentazionale".
  // Dipendenza: Molto alta con il GameLoop e le funzioni di aggiornamento. Richiede un'attenta migrazione.
  // =================================================================
  const [showIntro, setShowIntro] = useState(true);
  const [started, setStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(START_LEVEL);
  const [levelData, setLevelData] = useState(allLevels[START_LEVEL - 1]);
  const [isLevelTransitioning, setIsLevelTransitioning] = useState(false);
  const [isLevelReady, setIsLevelReady] = useState(false);
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPowerUpAura, setShowPowerUpAura] = useState(false); // Nuovi stati per l'effetto aura

  // =================================================================
  // Refactoring Priority: Ref1 - Riferimenti (Refs) e Animazioni
  // Azione: Spostare questi useRef e i relativi Animated.Value in un custom hook (es. 'hooks/useGameAssets.js' o insieme agli stati in 'hooks/useGameLogic.js').
  // Motivazione: Questi sono direttamente correlati allo stato e alla logica di gioco.
  // Dipendenza: Forte con le funzioni di aggiornamento del gioco e i componenti di rendering.
  // =================================================================
  const sidekickNameScaleAnim = useRef(new Animated.Value(0)).current;
  const sidekickNameOpacityAnim = useRef(new Animated.Value(0)).current;
  const livesRef = useRef(INITIAL_LIVES);
  const [dogX, setDogX] = useState(SCREEN_WIDTH / 2 - DOG_WIDTH / 2);
  const dogXRef = useRef(dogX);
  const poopRef = useRef([]);
  const enemyRef = useRef([]);
  const explosionsRef = useRef([]);
  const powerUpRef = useRef(null);
  const poopCount = useRef(0);
  const fartToggle = useRef(false);
  const enemyDirectionRef = useRef('right');
  const enemyMoveCounter = useRef(0);
  const lastFireTimeRef = useRef(0);
  const [, setTick] = useState(0); // Questo potrebbe essere rimosso se onUpdate non lo usa più
  const poopAudio = useRef(null);
  const fartAudio = useRef(null);
  const explosionAudio = useRef(null);
  const gameOverAudio = useRef(null);
  const backgroundMusic = useRef(null);
  const lifeAudio = useRef(null);
  const powerUpAudio = useRef(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const dogOpacityAnimation = useRef(new Animated.Value(1)).current;
  const dogScaleAnimation = useRef(new Animated.Value(1)).current;
  const gameOverScreenAnim = useRef(new Animated.Value(0)).current;
  const exitedScreenAnim = useRef(new Animated.Value(0)).current;
  const introScreenAnim = useRef(new Animated.Value(1)).current;
  const levelTransitionAnim = useRef(new Animated.Value(0)).current;
  const powerUpAuraScale = useRef(new Animated.Value(0)).current;
  const powerUpAuraOpacity = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });
  const latestHandleFireRef = useRef(); // Usato per PanResponder, può essere internalizzato nel PlayerControls o useGameLogic.

  const updateLevelEffects = useLevelEffects(levelData, shakeAnimation); // Questo hook è già esterno, ok.

  // =================================================================
  // Refactoring Priority: Ref2 - Logica di Navigazione Schermate
  // Azione: La logica `useEffect` per la leaderboard. Può essere spostata in un custom hook per la navigazione (es. `hooks/useGameNavigation.js`).
  // Motivazione: Separa la logica di transizione tra schermate dalla logica di gioco principale.
  // Dipendenza: Dipende dagli stati `isGameOver`, `showWinScreen`, `showLeaderboard`.
  // =================================================================
  useEffect(() => {
    if ((isGameOver || showWinScreen) && !showLeaderboard) {
      const timer = setTimeout(() => {
        setShowLeaderboard(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, showWinScreen, showLeaderboard]);

  // =================================================================
  // Refactoring Priority: Ref1 - Funzioni di Gioco (Sparo)
  // Azione: La funzione `handleFire` è una delle funzioni di gioco centrali. Dovrebbe essere parte del custom hook `useGameLogic`.
  // Motivazione: Fa parte della logica di input e interazione del giocatore.
  // Dipendenza: Dipende da `poopRef`, `dogXRef`, `isPoweredUp`, `levelData`, audioRefs.
  // =================================================================
  const handleFire = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTimeRef.current < FIRE_COOLDOWN) return;
    lastFireTimeRef.current = now;
    const currentDogX = dogXRef.current;
    // Sarà necessario passare i parametri ENEMY_WIDTH, ENEMY_HEIGHT a handlePoweredUpFire o renderli costanti globali.
    handlePoweredUpFire(poopRef, currentDogX, isPoweredUp, levelData);
    poopCount.current++;
    if (poopCount.current % 10 === 0) {
      if (fartToggle.current && fartAudio.current) fartAudio.current?.replayAsync();
      else if (poopAudio.current) poopAudio.current?.replayAsync();
      fartToggle.current = !fartToggle.current;
    }
  }, [isPoweredUp, levelData]);

  useEffect(() => {
    latestHandleFireRef.current = handleFire; // Questo accoppiamento può essere evitato se PanResponder è nel custom hook.
  }, [handleFire]);

  // =================================================================
  // Refactoring Priority: Ref1 - Controlli del Giocatore (PanResponder)
  // Azione: Spostare `panResponder` e tutta la sua logica (onStartShouldSetPanResponder, onPanResponderMove, ecc.) in un componente 'PlayerControls.js'
  // Motivazione: Isola l'interazione utente specifica per il movimento e lo sparo.
  // Dipendenza: Richiede `handleFire` e `setDogX` come props o accessibili tramite contesto/hook.
  // =================================================================
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        evt.nativeEvent.changedTouches.forEach(touch => {
          if (touch.pageX >= SCREEN_WIDTH * 0.7) latestHandleFireRef.current();
        });
      },
      onPanResponderMove: (evt) => {
        evt.nativeEvent.touches.forEach(touch => {
          if (touch.pageX < SCREEN_WIDTH * 0.7) {
            let newDogX = touch.pageX - (DOG_WIDTH / 2);
            newDogX = Math.max(0, Math.min(newDogX, SCREEN_WIDTH - DOG_WIDTH));
            dogXRef.current = newDogX;
            setDogX(newDogX);
          }
        });
      },
    })
  ).current;

  // =================================================================
  // Refactoring Priority: Ref1 - Caricamento Suoni Generici
  // Azione: Spostare questo `useEffect` in un custom hook per la gestione audio (es. 'hooks/useGameSounds.js' o integrato in `useGameLogic`).
  // Motivazione: Centralizza il caricamento e lo scaricamento delle risorse audio.
  // Dipendenza: Riferimenti audio (poopAudio, fartAudio, etc.).
  // =================================================================
  useEffect(() => {
    const loadGenericSounds = async () => {
      Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      poopAudio.current = new Audio.Sound(); fartAudio.current = new Audio.Sound(); explosionAudio.current = new Audio.Sound();
      gameOverAudio.current = new Audio.Sound(); lifeAudio.current = new Audio.Sound(); backgroundMusic.current = new Audio.Sound();
      powerUpAudio.current = new Audio.Sound();
      await poopAudio.current.loadAsync(poopSound);
      await fartAudio.current.loadAsync(fartSound);
      await explosionAudio.current.loadAsync(explosionSound);
      await gameOverAudio.current.loadAsync(gameOverSound);
      await lifeAudio.current.loadAsync(lifeSound);
      try {
        await powerUpAudio.current.loadAsync(powerUpSoundFile);
      } catch (e) {
        console.log("Audio powerup.mp3 non trovato.");
      }
    };
    loadGenericSounds();
    return () => {
      poopAudio.current?.unloadAsync(); fartAudio.current?.unloadAsync(); explosionAudio.current?.unloadAsync();
      gameOverAudio.current?.unloadAsync(); lifeAudio.current?.unloadAsync(); backgroundMusic.current?.unloadAsync();
      powerUpAudio.current?.unloadAsync();
    };
  }, []);

  // =================================================================
  // Refactoring Priority: Ref1 - Generazione Power-up
  // Azione: Spostare questo `useEffect` in un custom hook (es. 'hooks/usePowerUpManager.js' o integrato in `useGameLogic`).
  // Motivazione: Isola la logica di spawn dei power-up.
  // Dipendenza: `started`, `isPaused`, `isGameOver`, `isLevelTransitioning`, `powerUpRef`.
  // =================================================================
  useEffect(() => {
    let powerUpTimer;
    const schedulePowerUp = () => {
      if(started && !isPaused && !isGameOver && !isLevelTransitioning && !powerUpRef.current) {
        const delay = Math.random() * 3000 + 3000;
        powerUpTimer = setTimeout(() => {
          const HORIZONTAL_MARGIN = 40; // margine di sicurezza laterale

          powerUpRef.current = {
            x: HORIZONTAL_MARGIN + Math.random() * (SCREEN_WIDTH - POWERUP_SIZE - 2 * HORIZONTAL_MARGIN),
            y: -POWERUP_SIZE,
            rotation: 0
          };

          schedulePowerUp();
        }, delay);
      }
    };
    if (started) schedulePowerUp();
    return () => clearTimeout(powerUpTimer);
  }, [started, isPaused, isGameOver, isLevelTransitioning]);

  // =================================================================
  // Refactoring Priority: Ref1 - Gestione Musica di Sottofondo
  // Azione: Spostare questo `useEffect` in un custom hook per la gestione della musica (es. 'hooks/useBackgroundMusic.js' o 'hooks/useGameSounds.js').
  // Motivazione: Separa la logica audio complessa dalla logica di gioco principale.
  // Dipendenza: `backgroundMusic` ref, `started`, `isPaused`, `isGameOver`, `isExited`, `isLevelTransitioning`, `levelData`, `isMuted`.
  // =================================================================
  useEffect(() => {
    const manageMusic = async () => {
      if (!backgroundMusic.current) return;
      const shouldPlay = started && !isPaused && !isGameOver && !isExited && !isLevelTransitioning;
      const status = await backgroundMusic.current.getStatusAsync();
      if (shouldPlay) {
        if (!status.isPlaying) {
          try {
            if (status.isLoaded) await backgroundMusic.current.unloadAsync();
            await backgroundMusic.current.loadAsync(levelData.backgroundMusicFile, { isLooping: true });
            await backgroundMusic.current.setVolumeAsync(isMuted ? 0.0 : 0.5);
            await backgroundMusic.current.playAsync();
          } catch (e) {}
        }
      } else {
        if (status.isPlaying) {
          await backgroundMusic.current.pauseAsync();
        }
      }
    };
    manageMusic();
  }, [started, isPaused, isGameOver, isExited, isLevelTransitioning, levelData, isMuted]);

  // =================================================================
  // Refactoring Priority: Ref3 - Sincronizzazione Ref
  // Azione: Questi sono piccoli effetti, possono rimanere nel custom hook principale di GameLogic se creato.
  // Motivazione: Sono piccoli aggiornamenti di ref per la coerenza dei dati.
  // Dipendenza: Gli stati `lives` e `dogX`.
  // =================================================================
  useEffect(() => { livesRef.current = lives; }, [lives]);

  // =================================================================
  // Refactoring Priority: Ref2 - Animazione Nome Sidekick
  // Azione: Spostare questo `useEffect` e le relative animazioni in un componente `SidekickRenderer.js` o un custom hook specifico per il sidekick.
  // Motivazione: Isola la logica di rendering e animazione del sidekick.
  // Dipendenza: `isPoweredUp`, `levelData`, animazioni del nome.
  // =================================================================
  useEffect(() => {
    if (isPoweredUp && levelData.sidekickName) {
        sidekickNameScaleAnim.setValue(SIDEKICK_NAME_INITIAL_SCALE);
        sidekickNameOpacityAnim.setValue(0);
        Animated.sequence([
          Animated.parallel([
            Animated.timing(sidekickNameOpacityAnim, { toValue: 1, duration: SIDEKICK_NAME_FADE_IN_DURATION, useNativeDriver: true }),
            Animated.timing(sidekickNameScaleAnim, { toValue: SIDEKICK_NAME_FINAL_SCALE, duration: SIDEKICK_NAME_FADE_IN_DURATION, useNativeDriver: true })
          ]),
          Animated.delay(SIDEKICK_NAME_HOLD_DURATION),
          Animated.timing(sidekickNameOpacityAnim, { toValue: 0, duration: SIDEKICK_NAME_FADE_OUT_DURATION, useNativeDriver: true })
        ]).start();
      } else {
        sidekickNameScaleAnim.setValue(0);
        sidekickNameOpacityAnim.setValue(0);
      }
  }, [isPoweredUp, levelData]);

  // =================================================================
  // Refactoring Priority: Ref1 - Inizializzazione Nemici
  // Azione: Spostare `initializeEnemies` e il `useEffect` relativo in un custom hook (es. 'hooks/useGameLogic.js' o 'utils/EnemyManager.js' come funzione pura).
  // Motivazione: Parte cruciale della logica di inizio livello e gestione nemici.
  // Dipendenza: `levelData`, `enemyRef`, `enemyDirectionRef`, `enemyMoveCounter`.
  // =================================================================
  const initializeEnemies = useCallback(() => {
    const newEnemies = [];
    const { enemyRows, enemyCols, enemySpacing } = levelData;
    for (let row = 0; row < enemyRows; row++) {
      for (let col = 0; col < enemyCols; col++) {
        newEnemies.push({ id: `enemy-${row}-${col}`, x: col * (ENEMY_WIDTH + enemySpacing) + 20, y: row * (ENEMY_HEIGHT + enemySpacing) + 100, isExploding: false, explosionTimer: 0, width: ENEMY_WIDTH, height: ENEMY_HEIGHT });
      }
    }
    enemyRef.current = newEnemies;
    enemyDirectionRef.current = 'right'; enemyMoveCounter.current = 0; setIsLevelReady(true);
  }, [levelData]);

  useEffect(() => { if (started && !isGameOver && !isExited && !isLevelReady) { initializeEnemies(); } }, [started, isGameOver, isExited, isLevelReady, initializeEnemies]);

  // =================================================================
  // Refactoring Priority: Ref1 - Gestione Completamento Livello
  // Azione: Spostare `handleLevelComplete` in un custom hook (es. 'hooks/useGameLogic.js').
  // Motivazione: Logica centrale per la progressione del gioco.
  // Dipendenza: `isLevelTransitioning`, `setIsPoweredUp`, `powerUpRef`, `currentLevel`, `allLevels`, `setIsLevelReady`, `setCurrentLevel`, `setLevelData`, `dogXRef`, `setDogX`, `poopRef`, animazioni di transizione.
  // =================================================================
  const handleLevelComplete = useCallback(() => {
    if (isLevelTransitioning) return;
    setIsPoweredUp(false);
    powerUpRef.current = null;
    setIsLevelTransitioning(true);
    Animated.timing(levelTransitionAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        if (currentLevel >= allLevels.length) {
          setShowWinScreen(true);
        } else {
          setIsLevelReady(false);
          const nextLevel = currentLevel + 1;
          setCurrentLevel(nextLevel); setLevelData(allLevels[nextLevel - 1]);
          dogXRef.current = SCREEN_WIDTH / 2 - DOG_WIDTH / 2; setDogX(dogXRef.current);
          poopRef.current = [];
          Animated.timing(levelTransitionAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => { setIsLevelTransitioning(false); });
        }
      }, 2000);
    });
  }, [currentLevel, isLevelTransitioning]);

  // =================================================================
  // Refactoring Priority: Ref2 - Funzioni di Controllo Semplici
  // Azione: Spostare `forceNextLevel`, `togglePause`, `exitGame`, `handleIntroFinish`, `handleShowLeaderboardFromIntro` in un custom hook (es. `hooks/useGameControls.js` o `useGameLogic`).
  // Motivazione: Funzioni di interazione utente dirette che modificano lo stato del gioco o navigano.
  // Dipendenza: Stati di gioco e animazioni.
  // =================================================================
  const forceNextLevel = () => {
    if (isLevelTransitioning || isGameOver) return;
    enemyRef.current = [];
  };

  // =================================================================
  // Refactoring Priority: Ref1 - Ciclo di Aggiornamento del Gioco (`onUpdate`)
  // Azione: **Questo è il blocco più grande e complesso da spostare.** Deve essere interamente spostato in un custom hook (`hooks/useGameLogic.js`).
  // Motivazione: Contiene quasi tutta la logica di gameplay: movimento nemici, collisioni, gestione proiettili, power-up, game over.
  // Dipendenza: Dipende da quasi tutti gli stati, ref, e funzioni di supporto.
  // Passaggi:
  //   1. Crea `hooks/useGameLogic.js`.
  //   2. Sposta `onUpdate` al suo interno.
  //   3. Rendi tutti gli stati e ref necessari disponibili all'interno del hook (usando `useState`, `useRef` all'interno del hook e restituendoli).
  //   4. Rendi tutte le funzioni di supporto (es. `isColliding`, `createExplosionAnimation`, `handleGameOver`) *interni* al hook o importale da altri `utils/`.
  //   5. Infine, in `App.js`, chiama `const { onUpdate, ...altriStatiEFunzioni } = useGameLogic(...)`
  // =================================================================
  const onUpdate = () => {
    if (isPaused) return;
    updateLevelEffects();
    if (!started || isGameOver || isExited || isLevelTransitioning || !isLevelReady) return;
    if (enemyRef.current.length > 0 && enemyRef.current.every(e => e.isExploding)) { enemyRef.current = []; }
    if (enemyRef.current.length === 0) { handleLevelComplete(); return; }
    const dogBox = { x: dogXRef.current, y: SCREEN_HEIGHT - 140, width: DOG_WIDTH, height: DOG_HEIGHT };

    if (powerUpRef.current) {
      powerUpRef.current.y += 3;
      powerUpRef.current.rotation += 2;
      if (powerUpRef.current.y > SCREEN_HEIGHT) {
        powerUpRef.current = null;
      } else if (isColliding({ ...powerUpRef.current, width: POWERUP_SIZE, height: POWERUP_SIZE }, dogBox)) {
        powerUpAudio.current?.replayAsync();
        setIsPoweredUp(true);
        startShakeAnimation(shakeAnimation);
        powerUpRef.current = null;
        // Trigger the power-up aura animation
        setShowPowerUpAura(true);
        powerUpAuraScale.setValue(0);
        powerUpAuraOpacity.setValue(1);
        Animated.parallel([
          Animated.timing(powerUpAuraScale, { toValue: 10, duration: 400, useNativeDriver: true }),
          Animated.timing(powerUpAuraOpacity, { toValue: 0, duration: 400, delay: 100, useNativeDriver: true })
        ]).start(() => setShowPowerUpAura(false));
      }
    }

    enemyMoveCounter.current++;
    if (enemyMoveCounter.current >= levelData.enemyMoveInterval) {
      enemyMoveCounter.current = 0;
      let mustMoveDown = false;
      for (const enemy of enemyRef.current) {
        if (!enemy.isExploding) {
          if ((enemyDirectionRef.current === 'right' && enemy.x + enemy.width >= SCREEN_WIDTH) || (enemyDirectionRef.current === 'left' && enemy.x <= 0)) {
            mustMoveDown = true;
            break;
          }
        }
      }
      if (mustMoveDown) {
        enemyDirectionRef.current = enemyDirectionRef.current === 'right' ? 'left' : 'right';
        enemyRef.current = enemyRef.current.map(e => e.isExploding ? e : { ...e, y: e.y + ENEMY_VERTICAL_MOVE });
      } else {
        const xOffset = enemyDirectionRef.current === 'right' ? ENEMY_MOVE_SPEED : -ENEMY_MOVE_SPEED;
        enemyRef.current = enemyRef.current.map(e => e.isExploding ? e : { ...e, x: e.x + xOffset });
      }
    }

    const enemiesAfterUpdate = [];
    enemyRef.current.forEach(enemy => {
        if (enemy.isExploding) {
            enemy.explosionTimer--;
            if (enemy.explosionTimer > 0) enemiesAfterUpdate.push(enemy);
            return;
        }

        if (isColliding(enemy, dogBox)) {
            handleGameOver(); // Se un nemico tocca il cane, è game over
            return;
        }

        if (enemy.y + enemy.height >= SCREEN_HEIGHT - DOG_HEIGHT) {
            handleGameOver();
            return;
        }
        enemiesAfterUpdate.push(enemy);
    });
    enemyRef.current = enemiesAfterUpdate;

    poopRef.current = poopRef.current.map(p => ({ ...p, y: p.y - 6, x: p.x + (p.dx || 0) })).filter(p => p.y > -POOP_HEIGHT);
    const poopsThatMissed = [];
    poopRef.current.forEach(poop => {
      let poopHitSomething = false;
      const currentEnemies = [...enemyRef.current];
      for(let i = 0; i < currentEnemies.length; i++) {
          let enemy = currentEnemies[i];
          if (!enemy.isExploding && isColliding(poop, enemy)) {
              poopHitSomething = true;
              explosionAudio.current?.replayAsync();
              setScore(prevScore => prevScore + 10);
              createExplosionAnimation(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width, enemy.height);
              enemy.isExploding = true;
              enemy.explosionTimer = 10;
              break;
          }
      }
      if (!poopHitSomething) poopsThatMissed.push(poop);
    });
    poopRef.current = poopsThatMissed;

    setTick(t => t + 1);
  };

  // =================================================================
  // Refactoring Priority: Ref1 - Funzioni Helper di Gioco
  // Azione: Spostare `createExplosionAnimation` e `isColliding` in un file `utils/GameUtils.js` o nel custom hook `useGameLogic`.
  // Motivazione: Sono funzioni di utilità pura o legate alla logica di gameplay.
  // Dipendenza: Riferimenti `explosionsRef`, animazioni.
  // =================================================================
  const createExplosionAnimation = (x, y, width, height) => {
    const scaleAnim = new Animated.Value(0);
    const opacityAnim = new Animated.Value(1);
    const newExplosion = { id: Math.random(), x, y, scaleAnim, opacityAnim, width: width, height: height };
    explosionsRef.current.push(newExplosion);
    Animated.timing(scaleAnim, { toValue: 1.5, duration: 200, useNativeDriver: true }).start();
    Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true, delay: 100 }).start(() => {
      explosionsRef.current = explosionsRef.current.filter(exp => exp.id !== newExplosion.id);
    });
  };

  const isColliding = (o1, o2) => o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;

  // =================================================================
  // Refactoring Priority: Ref1 - Gestione Game Over / Reset / Exit
  // Azione: Spostare `handleGameOver` e `resetGame` in un custom hook (`hooks/useGameLogic.js`).
  // Motivazione: Logica centrale per la gestione degli stati finali del gioco e il reset.
  // Dipendenza: Molti stati, ref, audio e animazioni.
  // =================================================================
  const handleGameOver = () => {
    if (isGameOver) return;
    setIsPaused(false);
    setIsPoweredUp(false);
    powerUpRef.current = null;
    setIsGameOver(true);
    gameOverAudio.current?.replayAsync();
    shakeAnimation.setValue(0);
    Animated.parallel([
      Animated.timing(gameOverScreenAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(dogOpacityAnimation, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const resetGame = () => {
    setShowWinScreen(false);
    setCurrentLevel(START_LEVEL);
    setLevelData(allLevels[START_LEVEL - 1]);
    setDogX(SCREEN_WIDTH / 2 - DOG_WIDTH / 2);
    dogXRef.current = SCREEN_WIDTH / 2 - DOG_WIDTH / 2;
    poopRef.current = [];
    setScore(0);
    setLives(INITIAL_LIVES);
    setIsGameOver(false);
    setIsExited(false);
    setStarted(false);
    setIsPaused(false);
    setIsLevelTransitioning(false);
    setIsLevelReady(false);
    setIsPoweredUp(false);
    powerUpRef.current = null;
    gameOverScreenAnim.setValue(0);
    exitedScreenAnim.setValue(0);
    introScreenAnim.setValue(1);
    levelTransitionAnim.setValue(0);
    dogOpacityAnimation.setValue(1);
    shakeAnimation.setValue(0);
    setShowIntro(true);
    setShowLeaderboard(false);
    // Reset aura animation values
    powerUpAuraScale.setValue(0);
    powerUpAuraOpacity.setValue(1);
    setShowPowerUpAura(false);
  };

  // =================================================================
  // Refactoring Priority: Ref2 - Funzioni di Controllo Semplici (continuazione)
  // Azione: Spostare queste funzioni nel custom hook di GameLogic o un hook di controllo.
  // Motivazione: Simile a `forceNextLevel`.
  // =================================================================
  const togglePause = () => setIsPaused(prev => !prev);

  const exitGame = () => {
    setIsPaused(false);
    setIsExited(true);
    setStarted(false);
    Animated.timing(exitedScreenAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const handleIntroFinish = () => {
    Animated.timing(introScreenAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
      setShowIntro(false);
      setStarted(true);
    });
  };

  // --- CORREZIONE LOGICA LEADERBOARD ---
  const handleShowLeaderboardFromIntro = useCallback(() => {
    setShowIntro(false);
    setShowLeaderboard(true);
  }, []);

  if (!fontsLoaded) return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}><Text style={{ color: 'white', fontSize: 20 }}>Caricamento...</Text></View>);

  // =================================================================
  // Refactoring Priority: Ref2 - Rendering Condizionale Schermate
  // Azione: Questo blocco è la logica di "router" delle schermate principali. Può rimanere in `App.js` o essere leggermente incapsulato in un `GameScreenManager.js` ma la sua importanza qui è come punto di controllo principale.
  // Motivazione: Decidi quale schermata mostrare. App.js è il punto di ingresso principale per questo.
  // Dipendenza: `showLeaderboard`, `showIntro`, `score`, `resetGame`, `handleIntroFinish`, `handleShowLeaderboardFromIntro`.
  // =================================================================
  if (showLeaderboard) {
    return (<LeaderboardScreen score={score} onRestartGame={resetGame} />);
  }
  if (showIntro) {
    return (
      <Animated.View style={{ flex: 1, opacity: introScreenAnim }}>
        <IntroScreen onFinish={handleIntroFinish} onShowLeaderboard={handleShowLeaderboardFromIntro} />
      </Animated.View>
    );
  }

  // Se non siamo né in intro né in leaderboard, mostriamo il gioco o gli overlay
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {/* =================================================================
      // Refactoring Priority: Ref1 - Il GameLoop e il suo Contenuto Visivo Principale
      // Azione: Il `GameLoop` e tutto il suo contenuto interno (sfondo, cane, power-up, proiettili, nemici, esplosioni)
      // possono essere incapsulati in un componente `GameCanvas.js` o `GameScene.js`.
      // Motivazione: Isola il rendering di tutti gli elementi di gioco che si muovono o interagiscono.
      // Dipendenza: Tutti i ref e gli stati visivi (dogX, poopRef, enemyRef, explosionsRef, powerUpRef, animazioni).
      // Questo richiede che tutti questi dati siano passati come props o gestiti internamente dal nuovo componente.
      // ================================================================= */}
      <GameLoop onUpdate={onUpdate}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: shakeAnimation }] }}>
          <Image source={levelData.backgroundImage} style={baseStyles.background} resizeMode="cover" />
          {powerUpRef.current && (<Animated.Image source={powerUpImage} style={{ position: 'absolute', left: powerUpRef.current.x, top: powerUpRef.current.y, width: POWERUP_SIZE, height: POWERUP_SIZE, transform: [{ rotate: `${powerUpRef.current.rotation}deg` }] }} />)}
          {!isExited && !isLevelTransitioning && (
              <>
                <Animated.Image source={dogImage} style={[ baseStyles.dog, { left: dogX, opacity: dogOpacityAnimation, transform: [{ scale: dogScaleAnimation }, { translateX: shakeAnimation }] } ]} resizeMode="contain" />
                {/* Power-up Aura Effect */}
                {showPowerUpAura && (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      left: dogX + DOG_WIDTH / 2 - (DOG_WIDTH * 1.5) / 2, // Centra l'aura sul cane
                      top: SCREEN_HEIGHT - 140 + DOG_HEIGHT / 2 - (DOG_HEIGHT * 1.5) / 2, // Centra l'aura sul cane
                      width: DOG_WIDTH * 1.5, // Dimensione iniziale dell'aura
                      height: DOG_HEIGHT * 1.5, // Dimensione iniziale dell'aura
                      borderRadius: (DOG_WIDTH * 1.5) / 2, // Rende il cerchio
                      backgroundColor: 'rgba(255, 255, 0, 0.7)', // Giallo trasparente
                      opacity: powerUpAuraOpacity,
                      transform: [{ scale: powerUpAuraScale }],
                    }}
                  />
                )}
                {isPoweredUp && (
                  <View style={{ position: 'absolute', left: dogX - 60, bottom: 100 }}>
                    {levelData.sidekickComponent ? ( // Se esiste sidekickComponent, renderizzalo
                      levelData.sidekickComponent() // Chiama la funzione per ottenere il componente JSX
                    ) : levelData.sidekickImage ? ( // Altrimenti, se esiste sidekickImage, renderizza l'immagine
                      <Image
                        source={levelData.sidekickImage}
                        style={{
                          width: levelData.sidekickSize || DOG_WIDTH,
                          height: levelData.sidekickSize || DOG_HEIGHT,
                          resizeMode: 'contain'
                        }}
                      />
                    ) : null}

                    {levelData.sidekickName && (
                      <Animated.Text
                        style={[
                          baseStyles.sidekickNameText,
                          {
                            fontFamily: 'PressStart2P',
                            position: 'absolute',
                            // Centra il nome rispetto al sidekick, che ora è nel View
                            left: (levelData.sidekickSize || DOG_WIDTH) / 6 - (levelData.sidekickName.length * (SIDEKICK_NAME_FONT_SIZE / 2) / 2),
                            bottom: SIDEKICK_NAME_Y_OFFSET,
                            opacity: sidekickNameOpacityAnim,
                            transform: [{ scale: sidekickNameScaleAnim }]
                          }
                        ]}
                      >
                        {levelData.sidekickName}
                      </Animated.Text>
                    )}
                  </View>
                )}
              </>
          )}

          {poopRef.current.map((p, i) => (<Image key={`poop-${i}`} source={poopImage} style={[baseStyles.poop, { left: p.x, top: p.y }]} />))}
          {enemyRef.current.map((e) => (<Image key={e.id} source={levelData.enemyImage} style={[{ width: e.width || ENEMY_WIDTH, height: e.height || ENEMY_HEIGHT }, baseStyles.enemy, { left: e.x, top: e.y, opacity: e.isExploding ? 0 : 1 }]} />))}
          {explosionsRef.current.map(exp => ( <Animated.View key={`explosion-${exp.id}`} style={{ position: 'absolute', left: exp.x - (exp.width || ENEMY_WIDTH) / 2, top: exp.y - (exp.height || ENEMY_HEIGHT) / 2, width: exp.width || ENEMY_WIDTH, height: exp.height || ENEMY_HEIGHT, borderRadius: (exp.width || ENEMY_WIDTH) / 2, backgroundColor: 'orange', opacity: exp.opacityAnim, transform: [{ scale: exp.scaleAnim }], }} /> ))}

          {/* =================================================================
          // Refactoring Priority: Ref2 - UI di Gioco (HUD)
          // Azione: Spostare il container delle vite e del punteggio (`topInfoContainer`) e i pulsanti in alto (`topIconsContainer`) in un componente `GameHUD.js`.
          // Motivazione: Isola gli elementi dell'interfaccia utente durante il gameplay.
          // Dipendenza: `lives`, `score`, `togglePause`, `forceNextLevel`.
          // ================================================================= */}
          {started && !isGameOver && !isExited && (
            <>
              <View style={baseStyles.topInfoContainer}>
                <View style={baseStyles.livesContainer}>
                  {[...Array(lives)].map((_, i) => (<MaterialCommunityIcons key={`heart-${i}`} name="heart" size={30} color="red" />))}
                </View>
                <Text style={[baseStyles.scoreText, { fontFamily: 'PressStart2P' }]}>Score: {score}</Text>
              </View>
              <View style={baseStyles.topIconsContainer}>
                <TouchableOpacity onPress={togglePause} style={baseStyles.topIconButton}>
                  <MaterialCommunityIcons name="pause-circle-outline" size={26} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={forceNextLevel} style={baseStyles.topIconButton}>
                  <MaterialCommunityIcons name="skip-next" size={26} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </GameLoop>

      {/* =================================================================
      // Refactoring Priority: Ref1 - Controlli di Input (Area di Movimento/Sparo)
      // Azione: Spostare il `bottomControlsContainer` e i suoi elementi (`moveArea`, `fireArea`, `fireButton`) in un componente `PlayerControls.js`.
      // Motivazione: Isola l'area di input del giocatore.
      // Dipendenza: `panResponder.panHandlers`, `started`, `isGameOver`, `isExited`, `isLevelTransitioning`, `isPaused`.
      // ================================================================= */}
      {started && !isGameOver && !isExited && !isLevelTransitioning && !isPaused &&(
        <View style={baseStyles.bottomControlsContainer} {...panResponder.panHandlers}>
          <View style={baseStyles.moveArea} /><View style={baseStyles.fireArea}><View style={baseStyles.fireButton}><Text style={[baseStyles.fireButtonText, { fontFamily: 'PressStart2P' }]}>FIRE</Text></View></View>
        </View>
      )}

      {/* =================================================================
      // Refactoring Priority: Ref2 - Overlay Generici (Pausa, Game Over, Uscita, Transizione Livello)
      // Azione: Spostare tutti questi blocchi condizionali di rendering degli overlay in un componente `GameOverlays.js`.
      // Motivazione: Centralizza e semplifica il rendering delle schermate di stato.
      // Dipendenza: `isPaused`, `togglePause`, `exitGame`, `isLevelTransitioning`, `showWinScreen`, `currentLevel`, `score`, `isGameOver`, `gameOverScreenAnim`, `isExited`, `exitedScreenAnim`, `resetGame`.
      // ================================================================= */}
      {isPaused && (
        <View style={baseStyles.overlayContainer}>
          <Text style={[baseStyles.gameOverText, {fontFamily: 'PressStart2P', fontSize: PAUSE_TITLE_FONT_SIZE}]}>PAUSA</Text>
          <TouchableOpacity onPress={togglePause} style={[baseStyles.restartButton, {paddingVertical: PAUSE_BUTTON_PADDING_V, paddingHorizontal: PAUSE_BUTTON_PADDING_H}]}>
            <Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P', fontSize: PAUSE_BUTTON_FONT_SIZE }]}>RIPRENDI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={exitGame} style={[baseStyles.restartButton, {marginTop: 20, backgroundColor: '#800', paddingVertical: PAUSE_BUTTON_PADDING_V, paddingHorizontal: PAUSE_BUTTON_PADDING_H}]}>
            <Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P', fontSize: PAUSE_BUTTON_FONT_SIZE }]}>ESCI</Text>
          </Text>
        </View>
      )}

      {isLevelTransitioning && !showWinScreen && (<Animated.View style={[baseStyles.overlayContainer, { opacity: levelTransitionAnim }]}><Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Livello {currentLevel} Completato!</Text><Text style={[baseStyles.finalScoreText, { fontFamily: 'PressStart2P' }]}>Punteggio: {score}</Text></Animated.View>)}

      {isGameOver && !showLeaderboard && (
          <Animated.View style={[baseStyles.overlayContainer, { opacity: gameOverScreenAnim }]}>
              <Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Game Over</Text>
          </Animated.View>
      )}

      {isExited && (<Animated.View style={[baseStyles.overlayContainer, { opacity: exitedScreenAnim }]}><Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Hai interrotto il gioco</Text><TouchableOpacity onPress={resetGame} style={baseStyles.restartButton}><Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P' }]}>RIPROVA</Text></TouchableOpacity></Animated.View>)}
    </SafeAreaView>
  );
}