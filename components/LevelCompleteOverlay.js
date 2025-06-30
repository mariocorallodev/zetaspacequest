import React from 'react';
import { Animated, View, Text } from 'react-native';

export default function LevelCompleteOverlay({
  baseStyles,
  levelTransitionAnim,
  currentLevel,
  score
}) {
  return (
    <Animated.View style={[baseStyles.overlayContainer, { opacity: levelTransitionAnim }]}>
      <Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>
         Livello {currentLevel} Completato!
      </Text>
      <Text style={[baseStyles.finalScoreText, { fontFamily: 'PressStart2P' }]}>
        Punteggio: {score}
      </Text>
    </Animated.View>
  );
}
