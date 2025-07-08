// IntroScreen.js – Schermata iniziale con pulsante START e effetto anni '80

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, TouchableOpacity, Text, Dimensions } from 'react-native';
// Importa il hook useFonts e il font PressStart2P da expo-google-fonts
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { GAME_MODES } from '../utils/gameModes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const titleImage = require('../assets/splash.png');

// --- MODIFICATO: Aggiunta la prop onShowLeaderboard ---
export default function IntroScreen({ onPlay, onShowLeaderboard }) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.1);
  const startButtonOpacity = new Animated.Value(0);
  const topScoresButtonOpacity = new Animated.Value(0);
  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(startButtonOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(topScoresButtonOpacity, {
            toValue: 1,
            duration: 500,
            delay: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', fontSize: 20 }}>Caricamento Intro...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={titleImage}
        style={[
          styles.image,
          {
            opacity: opacity,
            transform: [{ scale: scale }],
          },
        ]}
        resizeMode="contain"
      />
      <View style={styles.buttonsContainer}>
        <Animated.View style={[{ opacity: startButtonOpacity }]}> 
          <TouchableOpacity onPress={onPlay} style={styles.startButton}>
            <Text style={styles.startButtonText}>GIOCA</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[{ opacity: topScoresButtonOpacity, marginTop: 15 }]}> 
          <TouchableOpacity onPress={onShowLeaderboard} style={styles.topScoresButton}>
            <Text style={styles.topScoresButtonText}>TOP SCORES</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.4,
    marginBottom: 40,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#ffe600',
    borderRadius: 10,
    borderWidth: 2,
    fontFamily: 'PressStart2P',
    borderColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
    width: 180,
  },
  startButtonText: {
    color: '#222',
    fontFamily: 'PressStart2P',
    fontSize: 18,
    textAlign: 'center',
  },
  topScoresButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    width: 180,
  },
  topScoresButtonText: {
    color: 'white',
    fontFamily: 'PressStart2P',
    fontSize: 16,
    textAlign: 'center',
  },
});