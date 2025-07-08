import React, { useRef, useCallback, useEffect, useState } from 'react';
import { PanResponder, Dimensions, TouchableOpacity, Text } from 'react-native';
import { handlePoweredUpFire } from '../PowerUpManager';
import VirtualJoystick from './VirtualJoystick';
import VisibleJoystick from './VisibleJoystick';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DOG_WIDTH = 80;
const FIRE_COOLDOWN = 250;
const DOG_MOVE_SPEED = 4; // Velocità bilanciata - non troppo lenta, non troppo veloce

export default function useGameControls({
  dogXRef,
  setDogX,
  poopRef,
  isPoweredUp,
  levelData,
  poopAudio,
  fartAudio,
  poopCount,
  fartToggle,
  onJoystickVisualUpdate
}) {
  const lastFireTimeRef = useRef(0);
  const latestHandleFireRef = useRef();
  const moveDirection = useRef(0); // -1 = sinistra, 0 = fermo, 1 = destra

  // Stato per la posizione dello slider (-1 = sx, 0 = centro, 1 = dx)
  const [sliderValue, setSliderValue] = useState(0);

  const handleFire = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTimeRef.current < FIRE_COOLDOWN) {
      return;
    }
    lastFireTimeRef.current = now;
    const currentDogX = dogXRef.current;
    handlePoweredUpFire(poopRef, currentDogX, isPoweredUp, levelData);
    poopCount.current++;
    if (poopCount.current % 10 === 0) {
      if (fartToggle.current && fartAudio.current) fartAudio.current?.replayAsync();
      else if (poopAudio.current) poopAudio.current?.replayAsync();
      fartToggle.current = !fartToggle.current;
    }
  }, [isPoweredUp, levelData, dogXRef, poopRef, poopCount, fartToggle, poopAudio, fartAudio]);

  useEffect(() => {
    latestHandleFireRef.current = handleFire;
  }, [handleFire]);

  // Gestione movimento del cane tramite joystick
  const handleJoystickMove = useCallback((horizontalPercent) => {
    moveDirection.current = horizontalPercent;
  }, []);

    // Funzione per aggiornare la posizione del cane (da chiamare nel game loop)
  const updateDogPosition = useCallback(() => {
    if (moveDirection.current !== 0) {
      const currentDogX = dogXRef.current;
      const newDogX = currentDogX + (moveDirection.current * DOG_MOVE_SPEED);
      const clampedDogX = Math.max(0, Math.min(newDogX, SCREEN_WIDTH - DOG_WIDTH));
      dogXRef.current = clampedDogX;
      setDogX(clampedDogX);
    }
  }, [dogXRef, setDogX]);

  // Barra di controllo tipo slider centrato
  const controlBarPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        handleSliderMove(evt);
      },
      onPanResponderMove: (evt, gestureState) => {
        handleSliderMove(evt);
      },
      onPanResponderRelease: () => {
        setSliderValue(0);
        moveDirection.current = 0;
        if (onJoystickVisualUpdate) {
          onJoystickVisualUpdate(0);
        }
      },
    })
  ).current;

  // Funzione per calcolare la posizione relativa del dito sulla barra
  const handleSliderMove = useCallback((evt) => {
    const { pageX } = evt.nativeEvent;
    const barWidth = SCREEN_WIDTH * 0.4;
    const barStartX = 20;
    // Calcola la posizione relativa rispetto al centro della barra
    let relative = ((pageX - barStartX) / barWidth - 0.5) * 2;
    relative = Math.max(-1, Math.min(1, relative));
    setSliderValue(relative);
    moveDirection.current = relative;
    if (onJoystickVisualUpdate) {
      onJoystickVisualUpdate(relative);
    }
  }, [onJoystickVisualUpdate]);

  // Area di sparo separata
  const fireAreaPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: () => {
        latestHandleFireRef.current();
      },
    })
  ).current;

  return {
    fireAreaPanResponder,
    controlBarPanResponder,
    handleFire,
    handleJoystickMove,
    updateDogPosition,
    sliderValue, // esporta lo stato per il componente visivo
    VirtualJoystickComponent: () => (
      <VirtualJoystick onMove={handleJoystickMove} />
    ),
    VisibleJoystickComponent: (baseStyles) => (
      <VisibleJoystick onMove={handleJoystickMove} baseStyles={baseStyles} />
    ),
    joystickPanResponder: VirtualJoystick.panResponder
  };
} 