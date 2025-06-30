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
import GameHUD from './components/GameHUD';
import TopIcons from './components/TopIcons';
import Dog from './components/Dog';
import Enemies from './components/Enemies';
import Poops from './components/Poops';
import Explosions from './components/Explosions';
import PauseOverlay from './components/PauseOverlay';
import GameOverOverlay from './components/GameOverOverlay';
import ExitOverlay from './components/ExitOverlay';
import LevelCompleteOverlay from './components/LevelCompleteOverlay';

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
import { level16Data } from './levels/level16';
import { level17Data } from './levels/level17';
import { level18Data } from './levels/level18';
import { level19Data } from './levels/level19';
import { level20Data } from './levels/level20';
import { level21Data } from './levels/level21';
import { level22Data } from './levels/level22';
import { level23Data } from './levels/level23';
import { level24Data } from './levels/level24';
import { level25Data } from './levels/level25';
// --- Importa la funzione di gestione dello sparo potenziato ---
import { handlePoweredUpFire } from './PowerUpManager';
// --- Importa la funzione di animazione del tremolio ---
import { startShakeAnimation } from './utils/Animations';
import { useLevelEffects } from './utils/bossShakeAnimation';

const allLevels = [level1Data, level2Data, level3Data, level4Data, level5Data, level6Data, level7Data, level8Data, level9Data, level10Data, level11Data, level12Data, level13Data, level14Data, level15Data, level16Data, level17Data, level18Data, level19Data, level20Data, level21Data, level22Data, level23Data, level24Data, level25Data];
const START_LEVEL = 1;

// --- COSTANTI DI GIOCO ---
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
  // Nuovi stati per l'effetto aura
  const [showPowerUpAura, setShowPowerUpAura] = useState(false);
  const [dogHit, setDogHit] = useState(false);

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
  const [, setTick] = useState(0);
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
  // Animazione per l'aura del power-up
  const powerUpAuraScale = useRef(new Animated.Value(0)).current;
  const powerUpAuraOpacity = useRef(new Animated.Value(1)).current;
  const dogHitAudio = useRef(null);

  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });
  const latestHandleFireRef = useRef();
  
  const updateLevelEffects = useLevelEffects(levelData, shakeAnimation);

  const bossRef = useRef(null);
  const bossHitAudio = useRef(null);
  const bossProjectilesRef = useRef([]);
  const bossShootTimerRef = useRef(0);

  useEffect(() => {
    if ((isGameOver || showWinScreen) && !showLeaderboard) {
      const timer = setTimeout(() => {
        setShowLeaderboard(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, showWinScreen, showLeaderboard]);

  const handleFire = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTimeRef.current < FIRE_COOLDOWN) return;
    lastFireTimeRef.current = now;
    const currentDogX = dogXRef.current;
    handlePoweredUpFire(poopRef, currentDogX, isPoweredUp, levelData);
    poopCount.current++;
    if (poopCount.current % 10 === 0) {
      if (fartToggle.current && fartAudio.current) fartAudio.current?.replayAsync();
      else if (poopAudio.current) poopAudio.current?.replayAsync();
      fartToggle.current = !fartToggle.current;
    }
  }, [isPoweredUp, levelData]);

  useEffect(() => {
    latestHandleFireRef.current = handleFire;
  }, [handleFire]);

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

  useEffect(() => {
    const loadGenericSounds = async () => {
      Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      poopAudio.current = new Audio.Sound(); fartAudio.current = new Audio.Sound(); explosionAudio.current = new Audio.Sound();
      gameOverAudio.current = new Audio.Sound(); lifeAudio.current = new Audio.Sound(); backgroundMusic.current = new Audio.Sound();
      powerUpAudio.current = new Audio.Sound();
      bossHitAudio.current = new Audio.Sound();
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
      try {
        await bossHitAudio.current.loadAsync(require('./assets/boss_hit.mp3'));
      } catch (e) {
        console.log("Audio boss_hit.mp3 non trovato.");
      }
      if (dogHitAudio.current == null) {
        dogHitAudio.current = new Audio.Sound();
        dogHitAudio.current.loadAsync(require('./assets/life.mp3'));
      }
    };
    loadGenericSounds();
    return () => {
      poopAudio.current?.unloadAsync(); fartAudio.current?.unloadAsync(); explosionAudio.current?.unloadAsync();
      gameOverAudio.current?.unloadAsync(); lifeAudio.current?.unloadAsync(); backgroundMusic.current?.unloadAsync();
      powerUpAudio.current?.unloadAsync();
      bossHitAudio.current?.unloadAsync();
    };
  }, []);

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

  useEffect(() => { livesRef.current = lives; }, [lives]);

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

  const initializeEnemies = useCallback(() => {
    if (levelData.isBossLevel) {
      bossRef.current = levelData.bossInit(levelData.enemyImage);
      setIsLevelReady(true);
      return;
    }
    // SOLO per livelli normali:
    const newEnemies = [];
    const { enemyRows, enemyCols, enemySpacing } = levelData;
    for (let row = 0; row < enemyRows; row++) {
      for (let col = 0; col < enemyCols; col++) {
        newEnemies.push({ id: `enemy-${row}-${col}`, x: col * (ENEMY_WIDTH + enemySpacing) + 20, y: row * (ENEMY_HEIGHT + enemySpacing) + 100, isExploding: false, explosionTimer: 0, width: ENEMY_WIDTH, height: ENEMY_HEIGHT });
      }
    }
    enemyRef.current = newEnemies;
    enemyDirectionRef.current = 'right';
    enemyMoveCounter.current = 0;
    setIsLevelReady(true);
  }, [levelData]);

  useEffect(() => { if (started && !isGameOver && !isExited && !isLevelReady) { initializeEnemies(); } }, [started, isGameOver, isExited, isLevelReady, initializeEnemies]);

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

  const forceNextLevel = () => {
    if (isLevelTransitioning || isGameOver) return;
    enemyRef.current = [];
  };

  useEffect(() => {
    // Reset proiettili boss a ogni cambio livello
    bossProjectilesRef.current = levelData.isBossLevel && levelData.bossProjectilesInit ? levelData.bossProjectilesInit() : [];
    bossShootTimerRef.current = 0;
  }, [levelData]);

  const onUpdate = () => {
    if (isPaused) return;
    updateLevelEffects();
    if (!started || isGameOver || isExited || isLevelTransitioning || !isLevelReady) return;

    if (levelData.isBossLevel && bossRef.current) {
      bossShootTimerRef.current++;
      // Movimento boss
      levelData.bossUpdate(bossRef.current, SCREEN_WIDTH, levelData.difficulty);
      // Colpi al boss
      const hit = levelData.bossCheckHit(bossRef.current, poopRef.current);
      if (hit) {
        bossHitAudio.current?.replayAsync();
        poopRef.current = poopRef.current.filter(p => !p.hit);
        setScore(prev => prev + 10);
      }
      // --- LOGICA PROIETTILI BOSS ---
      // Aggiorna proiettili
      if (levelData.bossProjectilesUpdate) {
        bossProjectilesRef.current = levelData.bossProjectilesUpdate(bossProjectilesRef.current, SCREEN_HEIGHT);
      }
      // Timer per sparo
      const baseShootInterval = 900; // 15 secondi se 60fps
      const minShootInterval = 300; // almeno 5 secondi
      const shootInterval = Math.max(baseShootInterval / levelData.difficulty, minShootInterval);

      if (bossShootTimerRef.current >= shootInterval) {
        bossShootTimerRef.current = 0;
        bossProjectilesRef.current.push(levelData.bossShoot(bossRef.current, levelData.difficulty));
      }
      // Collisione proiettili/cane
      bossProjectilesRef.current = bossProjectilesRef.current.filter(p => {
        const dogBox = { x: dogXRef.current, y: SCREEN_HEIGHT - 140, width: DOG_WIDTH, height: DOG_HEIGHT };
        const projBox = { x: p.x, y: p.y, width: p.size, height: p.size };
        const collides = projBox.x < dogBox.x + dogBox.width && projBox.x + projBox.width > dogBox.x && projBox.y < dogBox.y + dogBox.height && projBox.y + projBox.height > dogBox.y;
        if (collides) {
          setDogHit(true);
          dogHitAudio.current?.replayAsync();
          setTimeout(() => setDogHit(false), 300);
          setLives(l => {
            const newLives = Math.max(0, l - 1);
            if (newLives <= 0) handleGameOver();
            return newLives;
          });
          return false; // rimuovi proiettile
        }
        return true;
      });
      // Se il boss è morto, passa al prossimo livello
      if (bossRef.current.health <= 0) {
        bossRef.current = null;
        handleLevelComplete();
        return;
      }
    } else {
      // SOLO per livelli normali:
      if (enemyRef.current.length === 0) {
        handleLevelComplete();
        return;
      }
    }

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

  // --- CORREZIONE LOGICA DI RENDERING ---
  // Invece di tanti `if` separati, usiamo una logica più chiara.
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
      <GameLoop onUpdate={onUpdate}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: shakeAnimation }] }}>
          <Image source={levelData.backgroundImage} style={baseStyles.background} resizeMode="cover" />
          {powerUpRef.current && (<Animated.Image source={powerUpImage} style={{ position: 'absolute', left: powerUpRef.current.x, top: powerUpRef.current.y, width: POWERUP_SIZE, height: POWERUP_SIZE, transform: [{ rotate: `${powerUpRef.current.rotation}deg` }] }} />)}
          {!isExited && !isLevelTransitioning && (
              <>
                <Dog
                  dogImage={dogImage}
                  dogX={dogX}
                  baseStyles={baseStyles}
                  dogOpacityAnimation={dogHit ? 0.3 : dogOpacityAnimation}
                  dogScaleAnimation={dogScaleAnimation}
                  shakeAnimation={shakeAnimation}
                  DOG_WIDTH={DOG_WIDTH}
                  DOG_HEIGHT={DOG_HEIGHT}
                  SCREEN_HEIGHT={SCREEN_HEIGHT}
                  showPowerUpAura={showPowerUpAura}
                  powerUpAuraOpacity={powerUpAuraOpacity}
                  powerUpAuraScale={powerUpAuraScale}
                  isPoweredUp={isPoweredUp}
                  levelData={levelData}
                  sidekickNameOpacityAnim={sidekickNameOpacityAnim}
                  sidekickNameScaleAnim={sidekickNameScaleAnim}
                  SIDEKICK_NAME_FONT_SIZE={SIDEKICK_NAME_FONT_SIZE}
                  SIDEKICK_NAME_Y_OFFSET={SIDEKICK_NAME_Y_OFFSET}
                />
              </>
          )}

          <Poops
            poops={poopRef.current}
            poopImage={poopImage}
            baseStyles={baseStyles}
          />
          <Enemies
            enemies={enemyRef.current}
            enemyImage={levelData.enemyImage}
            baseStyles={baseStyles}
            ENEMY_WIDTH={ENEMY_WIDTH}
            ENEMY_HEIGHT={ENEMY_HEIGHT}
          />
          <Explosions
            explosions={explosionsRef.current}
            ENEMY_WIDTH={ENEMY_WIDTH}
            ENEMY_HEIGHT={ENEMY_HEIGHT}
          />

          {levelData.isBossLevel && bossRef.current && levelData.bossRender(bossRef.current)}
          {levelData.isBossLevel && bossRef.current && levelData.bossHealthBar(bossRef.current)}

          {levelData.isBossLevel && levelData.bossProjectilesRender && bossProjectilesRef.current && levelData.bossProjectilesRender(bossProjectilesRef.current)}

          {started && !isGameOver && !isExited && (
            <>
              <GameHUD lives={lives} score={score} baseStyles={baseStyles} />
              <TopIcons onPause={togglePause} onSkip={forceNextLevel} baseStyles={baseStyles} />
            </>
          )}
        </Animated.View>
      </GameLoop>

      {started && !isGameOver && !isExited && !isLevelTransitioning && !isPaused &&(
        <View style={baseStyles.bottomControlsContainer} {...panResponder.panHandlers}>
          <View style={baseStyles.moveArea} /><View style={baseStyles.fireArea}><View style={baseStyles.fireButton}><Text style={[baseStyles.fireButtonText, { fontFamily: 'PressStart2P' }]}>FIRE</Text></View></View>
        </View>
      )}
      
      {isPaused && (
        <PauseOverlay
          baseStyles={baseStyles}
          PAUSE_TITLE_FONT_SIZE={PAUSE_TITLE_FONT_SIZE}
          PAUSE_BUTTON_PADDING_V={PAUSE_BUTTON_PADDING_V}
          PAUSE_BUTTON_PADDING_H={PAUSE_BUTTON_PADDING_H}
          PAUSE_BUTTON_FONT_SIZE={PAUSE_BUTTON_FONT_SIZE}
          togglePause={togglePause}
          exitGame={exitGame}
        />
      )}

      {isLevelTransitioning && !showWinScreen && (
        <LevelCompleteOverlay
          baseStyles={baseStyles}
          levelTransitionAnim={levelTransitionAnim}
          currentLevel={currentLevel}
          score={score}
        />
      )}
      
      {isGameOver && !showLeaderboard && (
        <GameOverOverlay
          baseStyles={baseStyles}
          gameOverScreenAnim={gameOverScreenAnim}
        />
      )}

      {isExited && (
        <ExitOverlay
          baseStyles={baseStyles}
          exitedScreenAnim={exitedScreenAnim}
          resetGame={resetGame}
        />
      )}
    </SafeAreaView>
  );
}