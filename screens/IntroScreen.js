// IntroScreen.js – Componente "semplice" che riceve le funzioni di navigazione

import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const titleImage = require('../assets/splash.png');

// --- MODIFICA: Riceve onShowLeaderboard2 come prop ---
export default function IntroScreen({ onPlay, onShowLeaderboard, onShowLeaderboard2, onShowHowTo, onShowStory, onShowCredits }) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.1);
  const startButtonOpacity = new Animated.Value(0);
  const topScoresButtonOpacity = new Animated.Value(0);
  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });
  const musicRef = useRef(null);

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

  useEffect(() => {
    let isMounted = true;
    async function loadMusic() {
      try {
        // Musica principale di intro
        const { sound: music } = await Audio.Sound.createAsync(
          require('../assets/sounds/levels/zetareticoliintro.mp3'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        if (isMounted) musicRef.current = music;
      } catch (e) {}
    }
    loadMusic();
    return () => {
      isMounted = false;
      musicRef.current?.unloadAsync();
    };
  }, []);

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
        <Animated.View style={[styles.gridContainer, { opacity: topScoresButtonOpacity, marginTop: 30 }]}> 
          <View style={styles.gridRow}>
            <TouchableOpacity onPress={onShowHowTo} style={styles.gridButton}> 
              <Text style={styles.gridButtonText}>HOW TO</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShowLeaderboard} style={styles.gridButton}>
              <Text style={styles.gridButtonText}>TOP SCORES</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridRow}>
            <TouchableOpacity onPress={onShowStory} style={styles.gridButton}> 
              <Text style={styles.gridButtonText}>STORY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShowCredits} style={styles.gridButton}> 
              <Text style={styles.gridButtonText}>CREDITS</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 14.4,
    paddingHorizontal: 24,
    backgroundColor: '#ffe600',
    borderRadius: 10,
    borderWidth: 2,
    fontFamily: 'PressStart2P',
    borderColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
    width: 108,
    alignSelf: 'center',
  },
  startButtonText: {
    color: '#222',
    fontFamily: 'PressStart2P',
    fontSize: 10.8,
    textAlign: 'center',
  },
  gridContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridButton: {
    backgroundColor: '#222',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 11.2,
    paddingHorizontal: 14.4,
    marginHorizontal: 8,
    minWidth: 88,
    alignItems: 'center',
  },
  gridButtonText: {
    color: 'cyan',
    fontFamily: 'PressStart2P',
    fontSize: 9.6,
    textAlign: 'center',
  },
});
