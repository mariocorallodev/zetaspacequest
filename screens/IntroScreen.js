// IntroScreen.js – Schermata iniziale con pulsante START e effetto anni '80

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
// Importa il hook useFonts e il font PressStart2P da expo-google-fonts
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { GAME_MODES } from '../utils/gameModes';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const titleImage = require('../assets/splash.png');

// --- MODIFICATO: Aggiunta la prop onShowLeaderboard ---
export default function IntroScreen({ onFinish, onShowLeaderboard, selectedMode, onSelectMode }) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.1);
  const startButtonOpacity = new Animated.Value(0);
  // --- NUOVO: Opacity per il pulsante Top Scores ---
  const topScoresButtonOpacity = new Animated.Value(0);

  // Caricamento del font personalizzato "Press Start 2P" anche in IntroScreen
  const [fontsLoaded] = useFonts({
    'PressStart2P': PressStart2P_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) { // Assicurati che i font siano caricati prima di avviare le animazioni
      //console.log("IntroScreen.js: Font caricati, avvio animazione titolo.");
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
       // console.log("IntroScreen.js: Animazione titolo completata, mostrando START button.");
        Animated.parallel([ // Esegui le animazioni dei due bottoni in parallelo
          Animated.timing(startButtonOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(topScoresButtonOpacity, { // Animazione per il nuovo bottone
            toValue: 1,
            duration: 500,
            delay: 200, // Leggero ritardo per renderlo un po' più dinamico
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      //console.log("IntroScreen.js: Font non ancora caricati, in attesa...");
    }
  }, [fontsLoaded]); // Dipende da fontsLoaded, riavvia quando cambia

  // Se i font NON sono ancora stati caricati, mostra una schermata di caricamento interna
  if (!fontsLoaded) {
   // console.log("IntroScreen.js: Font non ancora caricati, mostrando schermata di caricamento IntroScreen.");
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

      <View style={styles.modeChoiceContainer}>
        <Text style={styles.modeChoiceLabel}>Modalità di gioco:</Text>
        {GAME_MODES.map(mode => (
          <TouchableOpacity
            key={mode.key}
            style={[styles.modeChoiceButton, selectedMode === mode.key && styles.modeChoiceButtonSelected]}
            onPress={() => onSelectMode(mode.key)}
          >
            <Text style={[styles.modeChoiceText, selectedMode === mode.key && styles.modeChoiceTextSelected]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <Animated.View style={[{ opacity: startButtonOpacity }]}> 
          <TouchableOpacity onPress={() => {
            console.log("[IntroScreen] Pulsante START premuto!");
              onFinish(); // Chiama la funzione onFinish passata da App.js
          }} style={styles.startButton}>
            <Text style={[styles.startButtonText, { fontFamily: 'PressStart2P' }]}>START</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[{ opacity: topScoresButtonOpacity, marginTop: 15 }]}> 
          <TouchableOpacity onPress={() => {
              console.log("[IntroScreen] Pulsante TOP SCORES premuto!");
              if (onShowLeaderboard) {
                onShowLeaderboard(); // Chiama la nuova funzione per mostrare la leaderboard
              }
          }} style={styles.topScoresButton}>
            <Text style={[styles.topScoresButtonText, { fontFamily: 'PressStart2P' }]}>TOP SCORES</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.4,
    marginBottom: 5,
  },
  modeChoiceContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    width: 140
  },
  startButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  topScoresButton: {
    paddingVertical: 15,
    paddingHorizontal: 28,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    width: 140,
  },
  topScoresButtonText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    width: 80,
  },
  modeChoiceLabel: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'PressStart2P',
    marginBottom: 18,
    letterSpacing: 1,
  },
  modeChoiceButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffe600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  modeChoiceButtonSelected: {
    backgroundColor: '#ffe600',
    borderColor: '#ffe600',
    shadowOpacity: 0.35,
  },
  modeChoiceText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'PressStart2P',
    letterSpacing: 1,
  },
  modeChoiceTextSelected: {
    color: '#222',
    fontWeight: 'bold',
  },
});