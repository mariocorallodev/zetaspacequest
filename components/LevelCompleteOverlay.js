import React from 'react';
import { Animated, View, Text } from 'react-native';

export default function LevelCompleteOverlay({
  baseStyles,
  levelTransitionAnim,
  currentLevel,
  score,
  phrase,
  phraseFontSize = 22,
  phraseMarginBottom = 18,
  levelFontSize = 18,
  levelMarginBottom = 0,
  scoreFontSize = 16
}) {
  return (
    <Animated.View style={[baseStyles.overlayContainer, { opacity: levelTransitionAnim }]}>
      <Text style={[baseStyles.gameOverText, {
        fontFamily: 'PressStart2P',
        color: '#ffe600',
        marginBottom: phraseMarginBottom,
        fontSize: phraseFontSize,
        textShadowColor: '#000',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 4
      }]}>
        {phrase}
      </Text>
      <Text style={[baseStyles.gameOverText, {
        fontFamily: 'PressStart2P',
        fontSize: levelFontSize,
        marginBottom: levelMarginBottom
      }]}>
         Livello {currentLevel} Completato!
      </Text>
      <Text style={[baseStyles.finalScoreText, {
        fontFamily: 'PressStart2P',
        fontSize: scoreFontSize
      }]}>
        Punteggio: {score}
      </Text>
    </Animated.View>
  );
}
