import React, { useRef, useState } from 'react';
import { View, PanResponder, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const JOYSTICK_RADIUS = 35; // Raggio massimo di movimento dello stick

export default function VisibleJoystick({ onMove, baseStyles }) {
  const [isActive, setIsActive] = useState(false);
  const stickPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  console.log('VisibleJoystick: Rendering, onMove:', typeof onMove, 'baseStyles:', !!baseStyles);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        console.log('VisibleJoystick: Touch detected!');
        setIsActive(true);
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = 50; // Centro del joystick (100/2)
        const centerY = 50;
        
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
        
        // Dead zone e curva di sensibilità
        let finalPercent = horizontalPercent;
        if (Math.abs(finalPercent) < 0.1) {
          finalPercent = 0;
        } else {
          finalPercent = Math.sign(finalPercent) * Math.pow(Math.abs(finalPercent), 1.5);
        }
        
        onMove(finalPercent);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = 50;
        const centerY = 50;
        
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
        
        // Dead zone e curva di sensibilità
        let finalPercent = horizontalPercent;
        if (Math.abs(finalPercent) < 0.1) {
          finalPercent = 0;
        } else {
          finalPercent = Math.sign(finalPercent) * Math.pow(Math.abs(finalPercent), 1.5);
        }
        
        onMove(finalPercent);
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

  return (
    <View style={baseStyles.joystickArea} {...panResponder.panHandlers}>
      <View style={baseStyles.joystickBase}>
        <Animated.View
          style={[
            baseStyles.joystickStick,
            {
              transform: [
                { translateX: stickPosition.x },
                { translateY: stickPosition.y }
              ]
            }
          ]}
        />
      </View>
    </View>
  );
} 