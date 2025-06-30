import React from 'react';
import { Animated, View, Text } from 'react-native';

export default function GameOverOverlay({ baseStyles, gameOverScreenAnim }) {
  return (
    <Animated.View style={[baseStyles.overlayContainer, { opacity: gameOverScreenAnim }]}>
      <Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Game Over</Text>
    </Animated.View>
  );
}
