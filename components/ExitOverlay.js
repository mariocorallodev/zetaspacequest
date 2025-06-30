import React from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';

export default function ExitOverlay({ baseStyles, exitedScreenAnim, resetGame }) {
  return (
    <Animated.View style={[baseStyles.overlayContainer, { opacity: exitedScreenAnim }]}>
      <Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>Hai interrotto il giuoco</Text>
      <TouchableOpacity onPress={resetGame} style={baseStyles.restartButton}>
        <Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P' }]}>RIPROVA</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
