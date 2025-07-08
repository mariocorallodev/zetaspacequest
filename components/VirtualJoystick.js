import React, { useRef, useState, useEffect } from 'react';
import { View, PanResponder, Dimensions, Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOG_WIDTH = 80;

const JOYSTICK_SIZE = 120;
const STICK_SIZE = 40;
const JOYSTICK_RADIUS = (JOYSTICK_SIZE - STICK_SIZE) / 2;

export default function VirtualJoystick({ onMove, style }) {
  const [isActive, setIsActive] = useState(false);
  const stickPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const joystickCenter = useRef({ x: JOYSTICK_SIZE / 2, y: JOYSTICK_SIZE / 2 });



  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('JOYSTICK: Touch detected!');
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        console.log('JOYSTICK: Move detected!');
        return true;
      },
      onPanResponderGrant: (evt) => {
        console.log('JOYSTICK: Grant called!');
        setIsActive(true);
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = joystickCenter.current.x;
        const centerY = joystickCenter.current.y;
        
        // Calcola la distanza dal centro
        const deltaX = locationX - centerX;
        const deltaY = locationY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Limita il movimento al raggio del joystick
        if (distance > JOYSTICK_RADIUS) {
          const angle = Math.atan2(deltaY, deltaX);
          const limitedDeltaX = Math.cos(angle) * JOYSTICK_RADIUS;
          const limitedDeltaY = Math.sin(angle) * JOYSTICK_RADIUS;
          stickPosition.setValue({ x: limitedDeltaX, y: limitedDeltaY });
        } else {
          stickPosition.setValue({ x: deltaX, y: deltaY });
        }
        
        // Calcola la percentuale di movimento orizzontale
        const horizontalPercent = Math.max(-1, Math.min(1, deltaX / JOYSTICK_RADIUS));
        onMove(horizontalPercent);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = joystickCenter.current.x;
        const centerY = joystickCenter.current.y;
        
        // Calcola la distanza dal centro
        const deltaX = locationX - centerX;
        const deltaY = locationY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Limita il movimento al raggio del joystick
        if (distance > JOYSTICK_RADIUS) {
          const angle = Math.atan2(deltaY, deltaX);
          const limitedDeltaX = Math.cos(angle) * JOYSTICK_RADIUS;
          const limitedDeltaY = Math.sin(angle) * JOYSTICK_RADIUS;
          stickPosition.setValue({ x: limitedDeltaX, y: limitedDeltaY });
        } else {
          stickPosition.setValue({ x: deltaX, y: deltaY });
        }
        
        // Calcola la percentuale di movimento orizzontale
        const horizontalPercent = Math.max(-1, Math.min(1, deltaX / JOYSTICK_RADIUS));
        onMove(horizontalPercent);
      },
      onPanResponderRelease: () => {
        setIsActive(false);
        // Ritorna il joystick al centro con animazione
        Animated.spring(stickPosition, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          tension: 100,
          friction: 8
        }).start();
        onMove(0); // Ferma il movimento
      },
    })
  ).current;

  console.log('JOYSTICK: Rendering component');
  return (
    <View 
      style={[
        {
          width: JOYSTICK_SIZE,
          height: JOYSTICK_SIZE,
          borderRadius: JOYSTICK_SIZE / 2,
          backgroundColor: 'rgba(255, 0, 0, 0.5)', // Rosso per debug
          borderWidth: 5,
          borderColor: 'rgba(255, 255, 255, 1)',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 200, // Più in alto per evitare il cane
          left: 30, // Più a sinistra
          zIndex: 9999, // Massimo z-index
          elevation: 9999, // Per Android
        },
        style
      ]}
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={{
          width: STICK_SIZE,
          height: STICK_SIZE,
          borderRadius: STICK_SIZE / 2,
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.9)',
          transform: [
            { translateX: stickPosition.x },
            { translateY: stickPosition.y }
          ]
        }}
      />
    </View>
  );
} 