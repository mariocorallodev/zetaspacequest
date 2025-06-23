// Game.js
// Contiene TUTTA la logica di gioco, spostata da App.js senza perdite.

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text, Animated, SafeAreaView, PanResponder } from 'react-native';
import { GameLoop } from 'react-native-game-engine';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

import baseStyles, {
    SIDEKICK_NAME_FADE_IN_DURATION,
    SIDEKICK_NAME_HOLD_DURATION,
    SIDEKICK_NAME_FADE_OUT_DURATION,
    SIDEKICK_NAME_INITIAL_SCALE,
    SIDEKICK_NAME_FINAL_SCALE,
    SIDEKICK_NAME_Y_OFFSET,
    SIDEKICK_NAME_FONT_SIZE
} from './styles/GameStyle';

import * as GameConstants from './game/constants';
import { handlePoweredUpFire } from './PowerUpManager';
import { startShakeAnimation } from './utils/Animations';

export default function Game({ levelData, onGameOver, onLevelComplete, onForceNextLevel }) {
    // --- STATO E REF INTERNI AL GIOCO ---
    const [lives, setLives] = useState(GameConstants.INITIAL_LIVES);
    const [score, setScore] = useState(0);
    const [isPoweredUp, setIsPoweredUp] = useState(false);
    const [isLevelReady, setIsLevelReady] = useState(false);
    const [dogX, setDogX] = useState(GameConstants.SCREEN_WIDTH / 2 - GameConstants.DOG_WIDTH / 2);
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

    // Audio Refs
    const poopAudio = useRef(new Audio.Sound());
    const fartAudio = useRef(new Audio.Sound());
    const explosionAudio = useRef(new Audio.Sound());
    const lifeAudio = useRef(new Audio.Sound());
    const powerUpAudio = useRef(new Audio.Sound());

    // Animation Refs
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const dogOpacityAnimation = useRef(new Animated.Value(1)).current;
    const dogScaleAnimation = useRef(new Animated.Value(1)).current;
    const sidekickNameScaleAnim = useRef(new Animated.Value(0)).current;
    const sidekickNameOpacityAnim = useRef(new Animated.Value(0)).current;

    const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });
    const latestHandleFireRef = useRef();

    // --- CARICAMENTO SUONI ---
    useEffect(() => {
        const loadSounds = async () => {
            await poopAudio.current.loadAsync(GameConstants.poopSound);
            await fartAudio.current.loadAsync(GameConstants.fartSound);
            await explosionAudio.current.loadAsync(GameConstants.explosionSound);
            await lifeAudio.current.loadAsync(GameConstants.lifeSound);
            await powerUpAudio.current.loadAsync(GameConstants.powerUpSoundFile);
        };
        loadSounds();
        return () => {
            poopAudio.current.unloadAsync();
            fartAudio.current.unloadAsync();
            explosionAudio.current.unloadAsync();
            lifeAudio.current.unloadAsync();
            powerUpAudio.current.unloadAsync();
        };
    }, []);

    const isColliding = (o1, o2) => o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;

    const createExplosionAnimation = (x, y, width, height) => {
        const scaleAnim = new Animated.Value(0);
        const opacityAnim = new Animated.Value(1);
        const newExplosion = { id: Math.random(), x, y, scaleAnim, opacityAnim, width, height };
        explosionsRef.current.push(newExplosion);
        Animated.timing(scaleAnim, { toValue: 1.5, duration: 200, useNativeDriver: true }).start();
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true, delay: 100 }).start(() => {
            explosionsRef.current = explosionsRef.current.filter(exp => exp.id !== newExplosion.id);
        });
    };
    
    // --- LOGICA DI GIOCO (SPOSTATA DA APP.JS) ---
    const handleFire = useCallback(() => {
        const now = Date.now();
        if (now - lastFireTimeRef.current < GameConstants.FIRE_COOLDOWN) return;
        lastFireTimeRef.current = now;
        handlePoweredUpFire(poopRef, dogXRef.current, isPoweredUp, levelData);
        poopCount.current++;
        if (poopCount.current % 10 === 0) {
            if (fartToggle.current) fartAudio.current?.replayAsync();
            else poopAudio.current?.replayAsync();
            fartToggle.current = !fartToggle.current;
        } else {
             poopAudio.current?.replayAsync();
        }
    }, [isPoweredUp, levelData]);

    useEffect(() => {
        latestHandleFireRef.current = handleFire;
    }, [handleFire]);
    
    // --- POWER-UP LOGIC ---
    useEffect(() => {
        let powerUpTimer;
        const schedulePowerUp = () => {
            if (!powerUpRef.current) {
                const delay = Math.random() * 3000 + 3000;
                powerUpTimer = setTimeout(() => {
                    powerUpRef.current = { x: Math.random() * (GameConstants.SCREEN_WIDTH - GameConstants.POWERUP_SIZE), y: -GameConstants.POWERUP_SIZE, rotation: 0 };
                    schedulePowerUp();
                }, delay);
            }
        };
        schedulePowerUp();
        return () => clearTimeout(powerUpTimer);
    }, []);

    // --- SIDEKICK ANIMATION LOGIC ---
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

    // Inizializza nemici
    useEffect(() => {
        const newEnemies = [];
        const { enemyRows, enemyCols, enemySpacing } = levelData;
        for (let row = 0; row < enemyRows; row++) {
            for (let col = 0; col < enemyCols; col++) {
                newEnemies.push({ id: `enemy-${row}-${col}`, x: col * (GameConstants.ENEMY_WIDTH + enemySpacing) + 20, y: row * (GameConstants.ENEMY_HEIGHT + enemySpacing) + 50, isExploding: false, explosionTimer: 0, width: GameConstants.ENEMY_WIDTH, height: GameConstants.ENEMY_HEIGHT });
            }
        }
        enemyRef.current = newEnemies;
        enemyDirectionRef.current = 'right';
        enemyMoveCounter.current = 0;
        setIsLevelReady(true);
    }, [levelData]);

    // GAME LOOP
    const onUpdate = () => {
        if (!isLevelReady) return;

        if (enemyRef.current.length === 0 && enemyRef.current.every(e => e.isExploding)) {
            onLevelComplete(score);
            return;
        }

        const dogBox = { x: dogXRef.current, y: GameConstants.SCREEN_HEIGHT - 140, width: GameConstants.DOG_WIDTH, height: GameConstants.DOG_HEIGHT };

        if (powerUpRef.current) {
            powerUpRef.current.y += 3;
            if (powerUpRef.current.y > GameConstants.SCREEN_HEIGHT) {
                powerUpRef.current = null;
            } else if (isColliding({ ...powerUpRef.current, width: GameConstants.POWERUP_SIZE, height: GameConstants.POWERUP_SIZE }, dogBox)) {
                powerUpAudio.current?.replayAsync();
                setIsPoweredUp(true);
                powerUpRef.current = null;
            }
        }
        
        enemyMoveCounter.current++;
        if (enemyMoveCounter.current >= levelData.enemyMoveInterval) {
            enemyMoveCounter.current = 0;
            let mustMoveDown = false;
            for (const enemy of enemyRef.current) {
                if (!enemy.isExploding && ( (enemyDirectionRef.current === 'right' && enemy.x + enemy.width >= GameConstants.SCREEN_WIDTH) || (enemyDirectionRef.current === 'left' && enemy.x <= 0) )) {
                    mustMoveDown = true;
                    break;
                }
            }
            if (mustMoveDown) {
                enemyDirectionRef.current = enemyDirectionRef.current === 'right' ? 'left' : 'right';
                enemyRef.current = enemyRef.current.map(e => e.isExploding ? e : { ...e, y: e.y + GameConstants.ENEMY_VERTICAL_MOVE });
            } else {
                const xOffset = enemyDirectionRef.current === 'right' ? GameConstants.ENEMY_MOVE_SPEED : -GameConstants.ENEMY_MOVE_SPEED;
                enemyRef.current = enemyRef.current.map(e => e.isExploding ? e : { ...e, x: e.x + xOffset });
            }
        }

        poopRef.current = poopRef.current.map(p => ({ ...p, y: p.y - 6, x: p.x + (p.dx || 0) })).filter(p => p.y > -GameConstants.POOP_HEIGHT);
        
        const enemiesAfterUpdate = [];
        enemyRef.current.forEach(enemy => {
            let enemyIsHit = false;
            poopRef.current.forEach(poop => {
                if (!poop.hit && !enemy.isExploding && isColliding(poop, enemy)) {
                    poop.hit = true;
                    enemyIsHit = true;
                }
            });

            if (enemyIsHit) {
                setScore(prev => prev + 10);
                explosionAudio.current?.replayAsync();
                createExplosionAnimation(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width, enemy.height);
                enemy.isExploding = true;
                enemy.explosionTimer = 10;
            }

            if (enemy.y + enemy.height >= GameConstants.SCREEN_HEIGHT - GameConstants.DOG_HEIGHT) {
                onGameOver(score);
                return;
            }

            if (!enemy.isExploding && isColliding(enemy, dogBox)) {
                setLives(prev => {
                    const newLives = prev - 1;
                    lifeAudio.current?.replayAsync();
                    if (newLives <= 0) onGameOver(score);
                    return newLives;
                });
                createExplosionAnimation(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width, enemy.height);
                enemy.isExploding = true;
                enemy.explosionTimer = 10;
            }

            if (!enemy.isExploding || enemy.explosionTimer > 0) {
                if (enemy.isExploding) enemy.explosionTimer--;
                enemiesAfterUpdate.push(enemy);
            }
        });
        enemyRef.current = enemiesAfterUpdate;
        poopRef.current = poopRef.current.filter(p => !p.hit);
        
        setTick(t => t + 1);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                evt.nativeEvent.changedTouches.forEach(touch => {
                    if (touch.pageX >= GameConstants.SCREEN_WIDTH * 0.7) latestHandleFireRef.current();
                });
            },
            onPanResponderMove: (evt) => {
                evt.nativeEvent.touches.forEach(touch => {
                    if (touch.pageX < GameConstants.SCREEN_WIDTH * 0.7) {
                        let newDogX = touch.pageX - (GameConstants.DOG_WIDTH / 2);
                        newDogX = Math.max(0, Math.min(newDogX, GameConstants.SCREEN_WIDTH - GameConstants.DOG_WIDTH));
                        dogXRef.current = newDogX;
                        setDogX(newDogX);
                    }
                });
            },
        })
    ).current;

    if (!fontsLoaded) return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white'}}>Caricamento Font...</Text></View>);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <GameLoop onUpdate={onUpdate}>
                <Animated.View style={{ flex: 1, transform: [{ translateX: shakeAnimation }] }}>
                    <Image source={levelData.backgroundImage} style={baseStyles.background} resizeMode="cover" />
                    {powerUpRef.current && (<Animated.Image source={GameConstants.powerUpImage} style={{ position: 'absolute', left: powerUpRef.current.x, top: powerUpRef.current.y, width: GameConstants.POWERUP_SIZE, height: GameConstants.POWERUP_SIZE, transform: [{ rotate: `${powerUpRef.current.rotation}deg` }] }} />)}
                    <Animated.Image source={GameConstants.dogImage} style={[baseStyles.dog, { left: dogX, opacity: dogOpacityAnimation, transform: [{ scale: dogScaleAnimation }, { translateX: shakeAnimation }] }]} resizeMode="contain" />
                    
                    {isPoweredUp && levelData.sidekickImage && (
                        <>
                            <Image source={levelData.sidekickImage} style={{ position: 'absolute', left: dogX - 60, bottom: 100, width: levelData.sidekickSize || GameConstants.DOG_WIDTH, height: levelData.sidekickSize || GameConstants.DOG_HEIGHT }} resizeMode="contain" />
                            {levelData.sidekickName && (
                                <Animated.Text style={[ baseStyles.sidekickNameText, { fontFamily: 'PressStart2P', position: 'absolute', bottom: SIDEKICK_NAME_Y_OFFSET, left: dogX - 60 + ((levelData.sidekickSize || GameConstants.DOG_WIDTH) / 2) - (levelData.sidekickName.length * (SIDEKICK_NAME_FONT_SIZE / 2)), opacity: sidekickNameOpacityAnim, transform: [{ scale: sidekickNameScaleAnim }] }]} >
                                    {levelData.sidekickName}
                                </Animated.Text>
                            )}
                        </>
                    )}

                    {poopRef.current.map((p, i) => (<Image key={`poop-${i}`} source={GameConstants.poopImage} style={[baseStyles.poop, { left: p.x, top: p.y }]} />))}
                    {enemyRef.current.map((e) => (<Image key={e.id} source={levelData.enemyImage} style={[{ width: e.width || GameConstants.ENEMY_WIDTH, height: e.height || GameConstants.ENEMY_HEIGHT }, baseStyles.enemy, { left: e.x, top: e.y, opacity: e.isExploding ? 0 : 1 }]} />))}
                    {explosionsRef.current.map(exp => (<Animated.View key={`explosion-${exp.id}`} style={{ position: 'absolute', left: exp.x - (exp.width || GameConstants.ENEMY_WIDTH) / 2, top: exp.y - (exp.height || GameConstants.ENEMY_HEIGHT) / 2, width: exp.width || GameConstants.ENEMY_WIDTH, height: exp.height || GameConstants.ENEMY_HEIGHT, borderRadius: (exp.width || GameConstants.ENEMY_WIDTH) / 2, backgroundColor: 'orange', opacity: exp.opacityAnim, transform: [{ scale: exp.scaleAnim }] }} />))}
                    
                    <View style={baseStyles.topInfoContainer}>
                        <View style={baseStyles.livesContainer}>
                            {[...Array(lives)].map((_, i) => (<MaterialCommunityIcons key={`heart-${i}`} name="heart" size={24} color="red" />))}
                        </View>
                        <Text style={[baseStyles.scoreText, { fontFamily: 'PressStart2P' }]}>Punteggio: {score}</Text>
                    </View>
                    <View style={baseStyles.topIconsContainer}>
                        {/* I pulsanti di uscita e skip ora sono gestiti da App.js */}
                    </View>
                </Animated.View>
            </GameLoop>
            <View style={baseStyles.bottomControlsContainer} {...panResponder.panHandlers}>
                <View style={baseStyles.moveArea} />
                <View style={baseStyles.fireArea}>
                    <TouchableOpacity onPress={latestHandleFireRef.current} style={baseStyles.fireButton}>
                        <Text style={[baseStyles.fireButtonText, { fontFamily: 'PressStart2P' }]}>FIRE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

