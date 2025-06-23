// IntroScreen.js – Schermata iniziale con pulsante START e effetto anni '80

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
// Importa il hook useFonts e il font PressStart2P da expo-google-fonts
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const titleImage = require('../assets/title.png');

// --- MODIFICATO: Aggiunta la prop onShowLeaderboard ---
export default function IntroScreen({ onFinish, onShowLeaderboard }) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.6);
  const startButtonOpacity = new Animated.Value(0);
  // --- NUOVO: Opacity per il pulsante Top Scores ---
  const topScoresButtonOpacity = new Animated.Value(0);

  // Caricamento del font personalizzato "Press Start 2P" anche in IntroScreen
  const [fontsLoaded] = useFonts({
    'PressStart2P': PressStart2P_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) { // Assicurati che i font siano caricati prima di avviare le animazioni
      console.log("IntroScreen.js: Font caricati, avvio animazione titolo.");
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log("IntroScreen.js: Animazione titolo completata, mostrando START button.");
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
      console.log("IntroScreen.js: Font non ancora caricati, in attesa...");
    }
  }, [fontsLoaded]); // Dipende da fontsLoaded, riavvia quando cambia

  // Se i font NON sono ancora stati caricati, mostra una schermata di caricamento interna
  if (!fontsLoaded) {
    console.log("IntroScreen.js: Font non ancora caricati, mostrando schermata di caricamento IntroScreen.");
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

      {/* Contenitore per i bottoni START e TOP SCORES */}
      <View style={styles.buttonsContainer}>
        <Animated.View style={[{ opacity: startButtonOpacity }]}>
          <TouchableOpacity onPress={() => {
              console.log("IntroScreen.js: Pulsante START premuto!");
              onFinish(); // Chiama la funzione onFinish passata da App.js
          }} style={styles.startButton}>
            <Text style={[styles.startButtonText, { fontFamily: 'PressStart2P' }]}>START</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* --- NUOVO: Pulsante TOP SCORES --- */}
        <Animated.View style={[{ opacity: topScoresButtonOpacity, marginTop: 15 }]}>
          <TouchableOpacity onPress={() => {
              console.log("IntroScreen.js: Pulsante TOP SCORES premuto!");
              if (onShowLeaderboard) {
                onShowLeaderboard(); // Chiama la nuova funzione per mostrare la leaderboard
              }
          }} style={styles.topScoresButton}>
            <Text style={[styles.topScoresButtonText, { fontFamily: 'PressStart2P' }]}>TOP SCORES</Text>
          </TouchableOpacity>
        </Animated.View>
        {/* --- Fine NUOVO --- */}

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
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.4,
    marginBottom: 50,
  },
  // --- NUOVO: Contenitore per i bottoni, posizionato in basso ---
  buttonsContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.15, // Un po' più in alto per fare spazio a due bottoni
    alignItems: 'center', // Centra i bottoni
  },
  // --- Fine NUOVO ---
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: 'lime',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // --- NUOVO: Stili per il pulsante TOP SCORES (simile a START ma con colore diverso) ---
  topScoresButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'cyan', // Un colore diverso, ad esempio ciano
    shadowColor: 'cyan', // Glow ciano
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  topScoresButtonText: {
    color: 'white',
    fontSize: 20, // Leggermente più piccolo per differenziare
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // --- Fine NUOVO ---
});