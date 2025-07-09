import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import AnimatedDog from '../components/AnimatedDog';
import AnimatedDog2 from '../components/AnimatedDog2';

const HOWTO_URL = 'https://raw.githubusercontent.com/mariocorallodev/zetacontent/refs/heads/main/howto.txt';

export default function CreditsScreen({ onBack }) {
  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });

  const [testo, setTesto] = useState('');
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(false);
  const [scrolling, setScrolling] = useState(true); // scroll attivo inizialmente
  const scrollViewRef = useRef(null);
  const soundRef = useRef(null);

  // Caricamento audio in loop
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/levels/1_4.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
      await sound.playAsync();
    })();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Caricamento testo da URL
  useEffect(() => {
    fetch(HOWTO_URL)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((text) => {
        setTesto(text);
        setLoading(false);
      })
      .catch(() => {
        setErrore(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!scrolling) return;

    let scrollPosition = 0;
    const scrollInterval = setInterval(() => {
      if (scrollViewRef.current) {
        scrollPosition += 1;
        scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false });
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, [scrolling]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'white' }}>Caricamento font...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scroll}
        scrollEnabled={true}
        onTouchStart={() => setScrolling(false)} // ⬅️ TAP o SCROLL disabilita auto-scroll
      >
        {/* Titolo */}
        <Text style={styles.titolo}>COME SI GIOCA</Text>

        {/* Animazione sotto al titolo */}
        <AnimatedDog size={180} />

        {/* Testo dinamico */}
        {loading ? (
          <ActivityIndicator size="large" color="#ffe600" />
        ) : errore ? (
          <Text style={styles.testo}>Errore nel caricamento del testo.</Text>
        ) : (
          <Text style={styles.testo}>{testo}</Text>
        )}

        {/* Animazione prima del bottone */}
        <AnimatedDog2 size={180} />

        {/* Bottone */}
        <TouchableOpacity style={styles.bottone} onPress={onBack}>
          <Text style={styles.bottoneTesto}>INDIETRO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================
// STILI STABILI
// ==========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 24,
  },
  scroll: {
    paddingTop: 24,
    paddingBottom: 60,
    alignItems: 'center',
  },
  titolo: {
    color: '#ffe600',
    fontSize: 24,
    fontFamily: 'PressStart2P',
    marginBottom: 12,
    textAlign: 'center',
  },
  testo: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'PressStart2P',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
    marginTop: 20,
  },
  bottone: {
    backgroundColor: '#ffe600',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 40,
  },
  bottoneTesto: {
    color: '#222',
    fontSize: 14,
    fontFamily: 'PressStart2P',
    textAlign: 'center',
  },
}); 