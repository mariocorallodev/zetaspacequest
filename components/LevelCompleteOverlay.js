import React from 'react';
import { Animated, View, Text } from 'react-native';

const phrases = [
  "GREAT JOB!",
  "LEVEL CLEARED!",
  "YOU DID IT!",
  "ON TO THE NEXT CHALLENGE!",
  "IMPRESSIVE!",
  "STAGE MASTERED!",
  "KEEP GOING!",
  "YOU'RE ON FIRE!",
  "UNSTOPPABLE!",
  "BOSS DEFEATED!"
];

export default function LevelCompleteOverlay({
  baseStyles,
  levelTransitionAnim,
  currentLevel,
  score
}) {
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  return (
    <Animated.View style={[baseStyles.overlayContainer, { opacity: levelTransitionAnim }]}>
      <Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P', color: '#ffe600', marginBottom: 18, textShadowColor: '#000', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 4 }]}>
        {randomPhrase}
      </Text>
      <Text style={[baseStyles.gameOverText, { fontFamily: 'PressStart2P' }]}>
         Livello {currentLevel} Completato!
      </Text>
      <Text style={[baseStyles.finalScoreText, { fontFamily: 'PressStart2P' }]}>
        Punteggio: {score}
      </Text>
    </Animated.View>
  );
}
