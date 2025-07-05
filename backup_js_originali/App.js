// App.js – Aggiornato con effetto tremolio per il power-up e gestione dei 7 livelli

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
import { MaterialCommunityIcons } from '@expo/vector-icons'; // CORREZIONE: Importazione corretta per MaterialCommunityIcons
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

// --- GESTIONE LIVELLI ---
import { level1Data } from './levels/level1';
import { level2Data } from './levels/level2';
import { level3Data } from './levels/level3'; 
import { level4Data } from './levels/level4';
import { level5Data } from './levels/level5';
import { level6Data } from './levels/level6';
import { level7Data } from './levels/level7';

// --- Importa la funzione di gestione dello sparo potenziato ---
import { handlePoweredUpFire } from './PowerUpManager';
// --- Importa la funzione di animazione del tremolio ---
import { startShakeAnimation } from './utils/Animations';

const allLevels = [level1Data, level2Data, level3Data, level4Data, level5Data, level6Data, level7Data];

// --- IMPOSTAZIONI DI DEBUG ---
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
const POWERUP_SIZE = 50; // --- POWER-UP: Dimensione dell'icona

// --- ASSET GENERICI ---
const dogImage = require('./assets/zeta2.png'); // Il giocatore principale è sempre zeta2.png
const poopImage = require('./assets/poop.png');
const poopSound = require('./assets/poop.mp3');
const fartSound = require('./assets/fart.mp3');
const explosionSound = require('./assets/explosion.mp3');
const gameOverSound = require('./assets/gameover.mp3');
const lifeSound = require('./assets/life.mp3');
// --- POWER-UP: Asset specifici ---
const powerUpImage = require('./assets/power.png');
const powerUpSoundFile = require('./assets/powerup.mp3');
// L'immagine del compagno ora è definita nel file di livello

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [started, setStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(START_LEVEL);
  const [levelData, setLevelData] = useState(allLevels[START_LEVEL - 1]);
  const [isLevelTransitioning, setIsLevelTransitioning] = useState(false);
  const [isLevelReady, setIsLevelReady] = useState(false);
  const [isPoweredUp, setIsPoweredUp] = useState(false); // --- POWER-UP: Stato per il potenziamento
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); 
  
  const sidekickNameScaleAnim = useRef(new Animated.Value(0)).current; 
  const sidekickNameOpacityAnim = useRef(new Animated.Value(0)).current; 

  const livesRef = useRef(INITIAL_LIVES);
  const [dogX, setDogX] = useState(SCREEN_WIDTH / 2 - DOG_WIDTH / 2);
  const dogXRef = useRef(dogX);
  const poopRef = useRef([]);
  const enemyRef = useRef([]);
  const explosionsRef = useRef([]);
  const powerUpRef = useRef(null); // --- POWER-UP: Ref per l'oggetto in caduta
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
  const powerUpAudio = useRef(null); // --- POWER-UP: Ref per il suono
  const shakeAnimation = useRef(new Animated.Value(0)).current; // Questa è l'Animated.Value per il tremolio del cane
  const dogOpacityAnimation = useRef(new Animated.Value(1)).current;
  const dogScaleAnimation = useRef(new Animated.Value(1)).current;
  const gameOverScreenAnim = useRef(new Animated.Value(0)).current;
  const exitedScreenAnim = useRef(new Animated.Value(0)).current;
  const introScreenAnim = useRef(new Animated.Value(1)).current;
  const levelTransitionAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });

  const latestHandleFireRef = useRef();

  const handleFire = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTimeRef.current < FIRE_COOLDOWN) {
        console.log("App.js - handleFire: Bloccato dal cooldown. Tempo rimanente:", FIRE_COOLDOWN - (now - lastFireTimeRef.current), "ms");
        return;
    }
    lastFireTimeRef.current = now;
    const currentDogX = dogXRef.current;

    console.log("App.js - handleFire: isPoweredUp (al momento dello sparo) =", isPoweredUp, "dogX =", currentDogX);
    
    handlePoweredUpFire(poopRef, currentDogX, isPoweredUp, levelData);

    console.log("App.js - handleFire: Proiettili attuali dopo sparo:", poopRef.current.length, poopRef.current);

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
          if (touch.pageX >= SCREEN_WIDTH * 0.7) {
            latestHandleFireRef.current(); 
          }
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
      powerUpAudio.current = new Audio.Sound(); // --- POWER-UP
      await poopAudio.current.loadAsync(poopSound); 
      await fartAudio.current.loadAsync(fartSound); 
      await explosionAudio.current.loadAsync(explosionSound);
      await gameOverAudio.current.loadAsync(gameOverSound); 
      await lifeAudio.current.loadAsync(lifeSound);
      try {
        await powerUpAudio.current.loadAsync(powerUpSoundFile); // --- POWER-UP
      } catch (e) {
        console.log("Audio powerup.mp3 non trovato, il powerup sarà silenzioso.");
      }
    };
    loadGenericSounds();
    return () => {
      poopAudio.current?.unloadAsync(); fartAudio.current?.unloadAsync(); explosionAudio.current?.unloadAsync();
      gameOverAudio.current?.unloadAsync(); lifeAudio.current?.unloadAsync(); backgroundMusic.current?.unloadAsync();
      powerUpAudio.current?.unloadAsync(); // --- POWER-UP
    };
  }, []);

  useEffect(() => {
    let powerUpTimer;
    const schedulePowerUp = () => {
        console.log("App.js - schedulePowerUp: started=", started, "isGameOver=", isGameOver, "isLevelTransitioning=", isLevelTransitioning, "powerUpRef.current=", !!powerUpRef.current);
        if(started && !isGameOver && !isLevelTransitioning && !powerUpRef.current) {
            const delay = Math.random() * 3000 + 3000;
            powerUpTimer = setTimeout(() => {
                powerUpRef.current = { x: Math.random() * (SCREEN_WIDTH - POWERUP_SIZE), y: -POWERUP_SIZE, rotation: 0 };
                console.log("App.js - Power-up generato a X:", powerUpRef.current.x);
                schedulePowerUp();
            }, delay);
        }
    };
    if (started) {
      schedulePowerUp();
    }
    return () => clearTimeout(powerUpTimer);
  }, [started, isGameOver, isLevelTransitioning]);

  useEffect(() => {
    const manageMusic = async () => {
      if (!backgroundMusic.current) return;
      const shouldPlay = started && !isGameOver && !isExited && !isLevelTransitioning;
      const status = await backgroundMusic.current.getStatusAsync();
      if (shouldPlay) {
        if (!status.isPlaying) {
          try {
            if (status.isLoaded) { await backgroundMusic.current.stopAsync(); await backgroundMusic.current.unloadAsync(); }
            await backgroundMusic.current.loadAsync(levelData.backgroundMusicFile, { isLooping: true });
            await backgroundMusic.current.setVolumeAsync(isMuted ? 0.0 : 0.5);
            await backgroundMusic.current.playAsync();
          } catch (e) {}
        }
      } else { if (status.isLoaded) { await backgroundMusic.current.stopAsync(); await backgroundMusic.current.unloadAsync(); } }
    };
    manageMusic();
  }, [started, isGameOver, isExited, isLevelTransitioning, levelData, isMuted]);

  useEffect(() => { livesRef.current = lives; }, [lives]);

  // --- Effetto per animare il nome del compagno quando il power-up è attivo ---
  useEffect(() => {
    if (isPoweredUp && levelData.sidekickName) {
      sidekickNameScaleAnim.setValue(SIDEKICK_NAME_INITIAL_SCALE); 
      sidekickNameOpacityAnim.setValue(0);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(sidekickNameOpacityAnim, {
            toValue: 1,
            duration: SIDEKICK_NAME_FADE_IN_DURATION, 
            useNativeDriver: true,
          }),
          Animated.timing(sidekickNameScaleAnim, {
            toValue: SIDEKICK_NAME_FINAL_SCALE, 
            duration: SIDEKICK_NAME_FADE_IN_DURATION,
            useNativeDriver: true,
          })
        ]),
        Animated.delay(SIDEKICK_NAME_HOLD_DURATION), 
        Animated.timing(sidekickNameOpacityAnim, {
          toValue: 0,
          duration: SIDEKICK_NAME_FADE_OUT_DURATION,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      sidekickNameScaleAnim.setValue(0); 
      sidekickNameOpacityAnim.setValue(0);
    }
  }, [isPoweredUp, levelData, sidekickNameScaleAnim, sidekickNameOpacityAnim]);

  const initializeEnemies = useCallback(() => {
    const newEnemies = [];
    const { enemyRows, enemyCols, enemySpacing } = levelData;
    for (let row = 0; row < enemyRows; row++) {
      for (let col = 0; col < enemyCols; col++) {
        newEnemies.push({
          id: `enemy-${row}-${col}`, x: col * (ENEMY_WIDTH + enemySpacing) + 20, y: row * (ENEMY_HEIGHT + enemySpacing) + 50,
          isExploding: false, explosionTimer: 0, width: ENEMY_WIDTH, height: ENEMY_HEIGHT,
        });
      }
    }
    enemyRef.current = newEnemies;
    enemyDirectionRef.current = 'right'; enemyMoveCounter.current = 0; setIsLevelReady(true);
    console.log("App.js - initializeEnemies: Nemici inizializzati. Numero:", newEnemies.length);
  }, [levelData]);

  useEffect(() => { if (started && !isGameOver && !isExited && !isLevelReady) { initializeEnemies(); } }, [started, isGameOver, isExited, isLevelReady, initializeEnemies]);

  const handleLevelComplete = useCallback(() => {
    if (isLevelTransitioning) return;
    setIsPoweredUp(false);
    powerUpRef.current = null;
    console.log("App.js - handleLevelComplete: Livello completato. isPoweredUp resettato.");
    setIsLevelTransitioning(true);
    Animated.timing(levelTransitionAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        if (currentLevel >= allLevels.length) {
          setShowWinScreen(true); 
          setIsGameOver(true);
          setShowLeaderboard(true); 
          console.log("App.js - handleLevelComplete: Tutti i livelli completati, schermata di vittoria.");
        } else {
          setIsLevelReady(false);
          const nextLevel = currentLevel + 1;
          setCurrentLevel(nextLevel); setLevelData(allLevels[nextLevel - 1]);
          dogXRef.current = SCREEN_WIDTH / 2 - DOG_WIDTH / 2; setDogX(dogXRef.current);
          poopRef.current = [];
          console.log("App.js - handleLevelComplete: Passaggio al livello", nextLevel);
          Animated.timing(levelTransitionAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => { setIsLevelTransitioning(false); });
        }
      }, 2000);
    });
  }, [currentLevel, isLevelTransitioning]);

  const forceNextLevel = () => { if (isLevelTransitioning || isGameOver) return; enemyRef.current = []; };

  const onUpdate = () => {
    if (!started || isGameOver || isExited || isLevelTransitioning || !isLevelReady) return;
    
    console.log("App.js - onUpdate: Inizio ciclo, isPoweredUp =", isPoweredUp);

    if (enemyRef.current.length > 0 && enemyRef.current.every(e => e.isExploding)) { enemyRef.current = []; }
    if (enemyRef.current.length === 0) { handleLevelComplete(); return; }
    
    const dogBox = { x: dogXRef.current, y: SCREEN_HEIGHT - 140, width: DOG_WIDTH, height: DOG_HEIGHT };

    if (powerUpRef.current) {
        powerUpRef.current.y += 3;
        powerUpRef.current.rotation += 2;
        if (powerUpRef.current.y > SCREEN_HEIGHT) {
            console.log("App.js - onUpdate: Power-up uscito dallo schermo.");
            powerUpRef.current = null;
        } else if (isColliding({ ...powerUpRef.current, width: POWERUP_SIZE, height: POWERUP_SIZE }, dogBox)) {
            console.log("App.js - onUpdate: Collisione power-up rilevata!");
            powerUpAudio.current?.replayAsync();
            setIsPoweredUp(true);
            // Avvia l'animazione del tremolio del cane quando raccoglie il power-up
            startShakeAnimation(shakeAnimation);
            console.log("App.js - onUpdate: Power-up acquisito! isPoweredUp impostato a TRUE.");
            powerUpRef.current = null;
        }
    }

    enemyMoveCounter.current++;
    if (enemyMoveCounter.current >= levelData.enemyMoveInterval) {
      enemyMoveCounter.current = 0;
      let mustMoveDown = false;
      for (const enemy of enemyRef.current) {
        if (!enemy.isExploding) {
          if (enemyDirectionRef.current === 'right' && enemy.x + enemy.width >= SCREEN_WIDTH) { mustMoveDown = true; break; }
          if (enemyDirectionRef.current === 'left' && enemy.x <= 0) { mustMoveDown = true; break; }
        }
      }
      let yOffset = 0;
      if (mustMoveDown) {
        enemyDirectionRef.current = enemyDirectionRef.current === 'right' ? 'left' : 'right';
        yOffset = ENEMY_VERTICAL_MOVE;
      }
      const xOffset = enemyDirectionRef.current === 'right' ? ENEMY_MOVE_SPEED : -ENEMY_MOVE_SPEED;
      enemyRef.current = enemyRef.current.map(e => {
        if (e.isExploding) return e;
        return { ...e, x: e.x + xOffset, y: e.y + yOffset };
      });
    }

    const enemiesAfterUpdate = [];
    for (let i = 0; i < enemyRef.current.length; i++) {
      const enemy = enemyRef.current[i];
      if (enemy.isExploding) {
        enemy.explosionTimer--;
        if (enemy.explosionTimer > 0) enemiesAfterUpdate.push(enemy);
        continue;
      }
      if (isColliding(enemy, dogBox)) {
        setLives(prevLives => {
          const newLives = prevLives - 1;
          console.log("App.js - onUpdate: Vite prima collisione:", prevLives, "Vite dopo collisione:", newLives);
          if (newLives < 0) return 0;
          if (newLives === 0) {
              handleGameOver();
          } else {
              lifeAudio.current?.replayAsync();
              // Avvia l'animazione del tremolio del cane anche quando subisce danni
              startShakeAnimation(shakeAnimation);
          }
          return newLives;
        });
        createExplosionAnimation(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        enemy.isExploding = true; enemy.explosionTimer = 10;
      }
      if (enemy.y + enemy.height >= SCREEN_HEIGHT - DOG_HEIGHT) { handleGameOver(); return; }
      enemiesAfterUpdate.push(enemy);
    }
    enemyRef.current = enemiesAfterUpdate;
    
    poopRef.current = poopRef.current.map(p => {
        return { ...p, y: p.y - 6, x: p.x + (p.dx || 0) };
    }).filter(p => p.y > -POOP_HEIGHT);

    const poopsThatMissed = [];
    poopRef.current.forEach(poop => {
      let poopHitSomething = false;
      enemyRef.current.forEach((enemy) => {
        if (!poopHitSomething && !enemy.isExploding && isColliding(poop, enemy)) {
          poopHitSomething = true;
          explosionAudio.current?.replayAsync();
          setScore(prevScore => prevScore + 10);
          console.log("App.js - onUpdate: Proiettile ha colpito un nemico! Score:", score + 10);
          createExplosionAnimation(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width, enemy.height);
          enemy.isExploding = true; enemy.explosionTimer = 10;
        }
      });
      if (!poopHitSomething) { poopsThatMissed.push(poop); }
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
      setTick(t => t + 1);
    });
  };

  const startShake = () => { /* Questa funzione è ora delegata a startShakeAnimation in utils/Animations.js */ };
  const startDogHitFeedback = () => { /* Puoi usare startShakeAnimation qui se vuoi un feedback sul colpo subìto */ }; 
  const isColliding = (o1, o2) => {
    if (!o1 || !o2) return false;
    if (typeof o1.x !== 'number' || typeof o1.y !== 'number' || typeof o1.width !== 'number' || typeof o1.height !== 'number') return false;
    if (typeof o2.x !== 'number' || typeof o2.y !== 'number' || typeof o2.width !== 'number' || typeof o2.height !== 'number') return false;
    return o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;
  };
  
  const handleGameOver = () => {
    setIsPoweredUp(false);
    powerUpRef.current = null;
    if (isGameOver) return;
    console.log("App.js - handleGameOver: GAME OVER! isPoweredUp resettato.");
    setIsGameOver(true);
    gameOverAudio.current?.replayAsync();
    shakeAnimation.setValue(0); 
    startShake(); 
    Animated.parallel([
      Animated.timing(gameOverScreenAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(dogOpacityAnimation, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setShowLeaderboard(true); 
    });
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
    console.log("App.js - resetGame: Gioco resettato.");
  };

  const exitGame = () => {
    setIsExited(true);
    setStarted(false);
    console.log("App.js - exitGame: Uscita dal gioco.");
    Animated.timing(exitedScreenAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const handleIntroFinish = () => {
    Animated.timing(introScreenAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
      setShowIntro(false);
      setStarted(true);
      console.log("App.js - handleIntroFinish: Intro completata, gioco avviato.");
    });
  };

  const handleShowLeaderboardFromIntro = useCallback(() => {
    setShowIntro(false);
    setShowLeaderboard(true);
    console.log("App.js - handleShowLeaderboardFromIntro: Mostra Leaderboard da Intro.");
  }, []);

  if (!fontsLoaded) return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}><Text style={{ color: 'white', fontSize: 20 }}>Caricamento...</Text></View>);
  
  if (showIntro) {
    return (
      <Animated.View style={{ flex: 1, opacity: introScreenAnim }}>
        <IntroScreen onFinish={handleIntroFinish} onShowLeaderboard={handleShowLeaderboardFromIntro} />
      </Animated.View>
    );
  }

  if ((isGameOver || showWinScreen) && showLeaderboard) { 
    return (<LeaderboardScreen score={score} onRestartGame={resetGame} />);
  }
  
  if (showLeaderboard && !isGameOver && !showWinScreen) {
      return (<LeaderboardScreen score={0} onRestartGame={resetGame} />);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <GameLoop onUpdate={onUpdate}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: shakeAnimation }] }}>
          <Image source={levelData.backgroundImage} style={baseStyles.background} resizeMode="cover" />
          
          {/* --- POWER-UP: Rendering dell'oggetto in caduta --- */}
          {powerUpRef.current && (
            <Animated.Image 
                source={powerUpImage}
                style={{
                    position: 'absolute',
                    left: powerUpRef.current.x,
                    top: powerUpRef.current.y,
                    width: POWERUP_SIZE,
                    height: POWERUP_SIZE,
                    transform: [{ rotate: `${powerUpRef.current.rotation}deg` }]
                }}
            />
          )}

          {!isExited && !isLevelTransitioning && (
             <>
                {/* Il giocatore principale è sempre zeta2.png */}
                <Animated.Image 
                    source={dogImage} 
                    style={[
                        baseStyles.dog, 
                        { 
                            left: dogX, 
                            opacity: dogOpacityAnimation, 
                            transform: [
                                { scale: dogScaleAnimation },
                                { translateX: shakeAnimation } // Applica l'animazione di tremolio qui
                            ] 
                        }
                    ]} 
                    resizeMode="contain" 
                />
                
                {/* --- POWER-UP: Rendering del compagno, con dimensione personalizzata dal livello */}
{isPoweredUp && levelData.sidekickImage && (
  <> {/* Inseriamo un frammento per raggruppare l'immagine e il testo */}
  <Image
    source={levelData.sidekickImage}
    style={{
      position: 'absolute',
      left: dogX - 60, // Posiziona il sidekick leggermente a sinistra del cane
      bottom: 100,
      width: levelData.sidekickSize || DOG_WIDTH,   // fallback a 80
      height: levelData.sidekickSize || DOG_HEIGHT, // fallback a 80
    }}
    resizeMode="contain"
  />
  {/* --- Testo con il nome del compagno animato e stili da GameStyle --- */}
  {levelData.sidekickName && (
    <Animated.Text // Utilizza Animated.Text per le animazioni di scala e opacità
      style={[
        baseStyles.sidekickNameText, // Usa il nuovo stile da GameStyle
        { 
          fontFamily: 'PressStart2P', 
          bottom: SIDEKICK_NAME_Y_OFFSET, // Utilizza l'offset Y da GameStyle
          left: dogX - 60 + (levelData.sidekickSize || DOG_WIDTH) / 2 - (levelData.sidekickName.length * (SIDEKICK_NAME_FONT_SIZE / 2)), // Centra il testo orizzontalmente
          // Applica le animazioni
          opacity: sidekickNameOpacityAnim,
          transform: [{ scale: sidekickNameScaleAnim }],
        }
      ]}
    >
      {levelData.sidekickName}
    </Animated.Text>
  )}
  </>
)}

             </>
          )}

          {poopRef.current.map((p, i) => (<Image key={`poop-${i}`} source={poopImage} style={[baseStyles.poop, { left: p.x, top: p.y }]} />))}
          
          {enemyRef.current.map((e) => (
             <Image key={e.id} source={levelData.enemyImage} style={[{ width: e.width || ENEMY_WIDTH, height: e.height || ENEMY_HEIGHT }, baseStyles.enemy, { left: e.x, top: e.y, opacity: e.isExploding ? 0 : 1 }]} />
          ))}
          
          {explosionsRef.current.map(exp => ( <Animated.View key={`explosion-${exp.id}`} style={{ position: 'absolute', left: exp.x - (exp.width || ENEMY_WIDTH) / 2, top: exp.y - (exp.height || ENEMY_HEIGHT) / 2, width: exp.width || ENEMY_WIDTH, height: exp.height || ENEMY_HEIGHT, borderRadius: (exp.width || ENEMY_WIDTH) / 2, backgroundColor: 'orange', opacity: exp.opacityAnim, transform: [{ scale: exp.scaleAnim }], }} /> ))}
          
          {started && !isGameOver && !isExited && (
            <>
              <View style={baseStyles.topInfoContainer}>
                <View style={baseStyles.livesContainer}>
                  {[...Array(lives)].map((_, i) => (<MaterialCommunityIcons key={`heart-${i}`} name="heart" size={24} color="red" />))}
                </View>
                <Text style={[baseStyles.scoreText, { fontFamily: 'PressStart2P' }]}>Punteggio: {score}</Text>
              </View>
              <View style={baseStyles.topIconsContainer}>
                <TouchableOpacity onPress={exitGame} style={baseStyles.topIconButton}><MaterialCommunityIcons name="exit-to-app" size={30} color="white" /></TouchableOpacity>
                <TouchableOpacity onPress={forceNextLevel} style={baseStyles.topIconButton}>
                  <MaterialCommunityIcons name="skip-next" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </GameLoop>
      
      {started && !isGameOver && !isExited && !isLevelTransitioning && (
        <View style={baseStyles.bottomControlsContainer} {...panResponder.panHandlers}>
          <View style={baseStyles.moveArea} /><View style={baseStyles.fireArea}><View style={baseStyles.fireButton}><Text style={[baseStyles.fireButtonText, { fontFamily: 'PressStart2P' }]}>FIRE</Text></View></View>
        </View>
      )}

      {isLevelTransitioning && !showWinScreen && (<Animated.View style={[baseStyles.overlayContainer, { opacity: levelTransitionAnim }]}><Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Livello {currentLevel} Completato!</Text><Text style={[baseStyles.finalScoreText, { fontFamily: 'PressStart2P' }]}>Punteggio: {score}</Text></Animated.View>)}
      {isGameOver && !showWinScreen && !showLeaderboard && (<Animated.View style={[baseStyles.overlayContainer, { opacity: gameOverScreenAnim }]}><Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Game Over</Text><Text style={[baseStyles.finalScoreText, { fontFamily: 'PressStart2P' }]}>Punteggio: {score}</Text><TouchableOpacity onPress={resetGame} style={baseStyles.restartButton}><Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P' }]}>RIPROVA</Text></TouchableOpacity></Animated.View>)}
      {isExited && (<Animated.View style={[baseStyles.overlayContainer, { opacity: exitedScreenAnim }]}><Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Hai interrotto il gioco</Text><TouchableOpacity onPress={resetGame} style={baseStyles.restartButton}><Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P' }]}>RIPROVA</Text></TouchableOpacity></Animated.View>)}
    </SafeAreaView>
  );
}
