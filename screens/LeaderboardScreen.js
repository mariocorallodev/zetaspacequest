// screens/LeaderboardScreen.js
// Schermata per mostrare la leaderboard e permettere al giocatore di inserire il proprio nome.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../supabaseClient'; // Assicurati che il percorso sia corretto
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import baseStyles from '../styles/GameStyle'; // Importa gli stili di base
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Definiamo nuovi stili specifici per la Leaderboard qui o li aggiungiamo a GameStyle.js
const leaderboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Sfondo nero per il tema retro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white', // Colore verde neon per il tema retro
    fontSize: 20,
    marginBottom: 10,
    marginTop: 20,
    textShadowColor: 'rgba(0, 255, 0, 0.75)', // Effetto glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  subtitle: {  // Colore Punteggio
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Campo input semitrasparente
    color: 'white',
    fontSize: 14,
    borderWidth: 2,
    borderColor: 'white', // Bordo verde neon
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '80%',
    maxWidth: 250,
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase', // Retro: nomi tutti maiuscoli
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white', // Pulsante salva
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 10,
  },
  buttonText: {   // Pulsante gioca ancora
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  leaderboardContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo leaderboard semitrasparente
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'white', // Bordo viola neon
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    maxHeight: SCREEN_HEIGHT * 0.4, // Limita l'altezza per schermi più piccoli
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 5,
  },
  headerText: {
    color: 'white', // Testo pos nome punti
    fontSize: 12,
    fontWeight: 'regular',
    flex: 1,
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreText: {
    color: 'white',
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  noScoresText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
  }
});


export default function LeaderboardScreen({ score, onRestartGame }) {
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);
  const scrollViewRef = useRef(null);
  const scrollOffset = useRef(0);
  const scrollInterval = useRef(null);
  const [itemHeight, setItemHeight] = useState(32); // Altezza dinamica
  const manualScrollActive = useRef(false); // Flag per tracciare scroll manuale
  const manualScrollTimeout = useRef(null); // Timeout per riprendere scroll automatico

  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    // Funzione per caricare e riprodurre il suono in loop
    async function playMusic() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/levels/zetareticoli.mp3'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        soundRef.current = sound;
      } catch (e) {
        console.log('Errore caricamento audio leaderboard:', e);
      }
    }
    playMusic();
    return () => {
      // Stoppa e rilascia il suono quando si esce dalla schermata
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  // Funzione per salvare il punteggio
  const saveScore = async () => {
    if (!playerName.trim()) {
      alert('Inserisci un nickname per salvare il tuo punteggio!');
      return;
    }
    setLoading(true);
    try {
      // Modificato il nome della tabella da 'scores' a 'zeta' come da tua richiesta SQL
      const { data, error } = await supabase
        .from('zeta')
        .insert([{ player_name: playerName.toUpperCase(), score: score }]); // Salva il nome in maiuscolo
      if (error) throw error;
      //console.log('Punteggio salvato:', data);
      setScoreSaved(true);
      
      // Trova la posizione del giocatore nella leaderboard
      const { data: allScores, error: rankError } = await supabase
        .from('zeta')
        .select('player_name, score')
        .order('score', { ascending: false });
      
      if (!rankError && allScores) {
        const position = allScores.findIndex(item => 
          item.player_name === playerName.toUpperCase() && item.score === score
        ) + 1;
        setPlayerPosition(position);
      }
      
      fetchLeaderboard(); // Aggiorna la leaderboard dopo aver salvato il punteggio
    } catch (error) {
      console.error('Errore nel salvare il punteggio:', error.message);
      alert('Errore nel salvare il punteggio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per recuperare i punteggi più alti
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      // Modificato il nome della tabella da 'scores' a 'zeta' come da tua richiesta SQL
      const { data, error } = await supabase
        .from('zeta')
        .select('player_name, score')
        .order('score', { ascending: false }) // Ordina dal più alto al più basso
        .limit(100); // Recupera i primi 10 punteggi
      if (error) throw error;
      setLeaderboard(data);
    } catch (error) {
      console.error('Errore nel recuperare la leaderboard:', error.message);
      alert('Errore nel recuperare la leaderboard: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    // --- SCROLL AUTOMATICO LEADERBOARD DINAMICO ---
    if (leaderboard.length > 3 && itemHeight > 0) { // Solo se ci sono più di 3 elementi
      const visibleItems = Math.floor((SCREEN_HEIGHT * 0.4 - 60) / itemHeight); // Calcolo più accurato
      const maxScroll = Math.max(0, (leaderboard.length - visibleItems) * itemHeight);
      
      scrollInterval.current = setInterval(() => {
        if (scrollViewRef.current && !manualScrollActive.current) {
          scrollOffset.current += itemHeight;
          // Se siamo arrivati in fondo, ricomincia da capo
          if (scrollOffset.current >= maxScroll) {
            scrollOffset.current = 0;
          }
          scrollViewRef.current.scrollTo({ y: scrollOffset.current, animated: true });
        }
      }, 2000); // Aumentato il tempo per una lettura più comoda
    }
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
        scrollInterval.current = null;
      }
      if (manualScrollTimeout.current) {
        clearTimeout(manualScrollTimeout.current);
        manualScrollTimeout.current = null;
      }
    };
  }, [leaderboard, itemHeight]);
  
  // --- LOG DI DEBUG AGGIUNTO ---
  // Questo log mostrerà nella console i dati esatti della leaderboard prima che vengano renderizzati.
  // Utile per controllare se ci sono valori nulli o inaspettati.
  //console.log('Dati leaderboard pronti per il render:', JSON.stringify(leaderboard, null, 2));


  if (!fontsLoaded) {
    return (
      <View style={leaderboardStyles.container}>
        <Text style={leaderboardStyles.subtitle}>Caricamento</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Animated.View style={[leaderboardStyles.container, { opacity: fadeAnim }]}>
        <Text style={[leaderboardStyles.title, { fontFamily: 'PressStart2P' }]}>
          LEADERBOARD
        </Text>
        <Text style={[leaderboardStyles.subtitle, { fontFamily: 'PressStart2P' }]}>
          Punteggio: {score}
        </Text>

        {!scoreSaved ? (
          <>
            <TextInput
              style={[leaderboardStyles.input, { fontFamily: 'PressStart2P' }]}
              placeholder="Nick (max 3)"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={playerName}
              onChangeText={(text) => setPlayerName(text.slice(0, 3))} // Limita a 3 caratteri
              maxLength={3}
              autoCapitalize="characters" // Forza maiuscolo
              editable={!loading}
            />
            <TouchableOpacity
              onPress={saveScore}
              style={leaderboardStyles.button}
              disabled={loading}
            >
              <Text style={[leaderboardStyles.buttonText, { fontFamily: 'PressStart2P' }]}>
                {loading ? 'Salvataggio...' : 'SALVA'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[leaderboardStyles.subtitle, { fontFamily: 'PressStart2P', color: 'yellow' }]}>
              Punteggio salvato!
            </Text>
            {playerPosition && (
              <>
                <Text style={[leaderboardStyles.subtitle, { fontFamily: 'PressStart2P', color: '#FF00FF', marginTop: 5 }]}>
                  Complimenti {playerName.toUpperCase()}!
                </Text>
                <Text style={[leaderboardStyles.subtitle, { fontFamily: 'PressStart2P', color: '#00FFFF' }]}>
                  Sei in {playerPosition}ª posizione!
                </Text>
              </>
            )}
          </>
        )}

        <Text style={[leaderboardStyles.subtitle, { fontFamily: 'PressStart2P', marginTop: 14 }]}>
          TOP 100
        </Text>
        <View style={leaderboardStyles.leaderboardContainer}>
          <View style={leaderboardStyles.leaderboardHeader}>
            <Text style={[leaderboardStyles.headerText, { fontFamily: 'PressStart2P' }]}>POS</Text>
            <Text style={[leaderboardStyles.headerText, { fontFamily: 'PressStart2P' }]}>NOME</Text>
            <Text style={[leaderboardStyles.headerText, { fontFamily: 'PressStart2P' }]}>PUNTI</Text>
          </View>
          <ScrollView 
            ref={scrollViewRef} 
            showsVerticalScrollIndicator={false} 
            scrollEnabled={true}
            onScrollBeginDrag={() => {
              manualScrollActive.current = true;
              if (manualScrollTimeout.current) {
                clearTimeout(manualScrollTimeout.current);
              }
            }}
            onScrollEndDrag={(event) => {
              // Aggiorna la posizione di scroll automatico con quella manuale
              scrollOffset.current = event.nativeEvent.contentOffset.y;
              // Riprendi lo scroll automatico dopo 3 secondi di inattività
              manualScrollTimeout.current = setTimeout(() => {
                manualScrollActive.current = false;
              }, 3000);
            }}
            onMomentumScrollEnd={(event) => {
              // Aggiorna anche quando lo scroll termina per inerzia
              scrollOffset.current = event.nativeEvent.contentOffset.y;
              manualScrollTimeout.current = setTimeout(() => {
                manualScrollActive.current = false;
              }, 3000);
            }}
          >
            {leaderboard.length > 0 ? (
              leaderboard.map((item, index) => (
                <View key={item.id || index} style={leaderboardStyles.scoreItem}
                  onLayout={index === 0 ? (e) => setItemHeight(e.nativeEvent.layout.height) : undefined}>
                  <Text style={[leaderboardStyles.scoreText, { fontFamily: 'PressStart2P' }]}> {index + 1}. </Text>
                  <Text style={[leaderboardStyles.scoreText, { fontFamily: 'PressStart2P' }]}>{item.player_name}</Text>
                  <Text style={[leaderboardStyles.scoreText, { fontFamily: 'PressStart2P' }]}>{item.score}</Text>
                </View>
              ))
            ) : (
              <Text style={[leaderboardStyles.noScoresText, { fontFamily: 'PressStart2P' }]}>Nessun punteggio disponibile. Sii il primo!</Text>
            )}
          </ScrollView>
          {/* --- CORREZIONE APPLICATA QUI --- */}
          {/* Usiamo un operatore ternario per essere sicuri di non renderizzare mai valori non validi come 'false' o '0' */}
          {loading ? <Text style={[leaderboardStyles.subtitle, { fontFamily: 'PressStart2P', color: 'grey' }]}>Caricamento...</Text> : null}
        </View>

        <TouchableOpacity
          onPress={onRestartGame}
          style={[leaderboardStyles.button, { marginTop: 30, borderColor: 'white', shadowColor: 'white' }]}
        >
          <Text style={[leaderboardStyles.buttonText, { fontFamily: 'PressStart2P' }]}>
            GIOCA ANCORA
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}