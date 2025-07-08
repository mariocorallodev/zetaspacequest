import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { supabase } from '../supabaseClient';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const leaderboard2Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 20,
    textShadowColor: 'rgba(0, 255, 0, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  leaderboardBox: {
    width: '100%',
    maxWidth: 350,
    height: 260, // Mostra ~8-10 righe
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    marginBottom: 20,
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
    color: 'white',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  scoreText: {
    color: 'white',
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'PressStart2P',
  },
});

export default function Leaderboard2Screen({ onBack }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [itemHeight, setItemHeight] = useState(26);

  useEffect(() => {
    async function fetchAllScores() {
      const { data, error } = await supabase
        .from('zeta')
        .select('player_name, score')
        .order('score', { ascending: false });
      if (!error && data) setLeaderboard(data);
    }
    fetchAllScores();
  }, []);

  // Scroll automatico ciclico
  useEffect(() => {
    if (leaderboard.length > 8) {
      let index = 0;
      const interval = setInterval(() => {
        index++;
        if (index > leaderboard.length - 8) index = 0;
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: index * itemHeight, animated: true });
        }
      }, 1600);
      return () => clearInterval(interval);
    }
  }, [leaderboard, itemHeight]);

  if (!fontsLoaded) {
    return <View style={leaderboard2Styles.container}><Text style={leaderboard2Styles.headerText}>Caricamento...</Text></View>;
  }

  return (
    <View style={leaderboard2Styles.container}>
      <Text style={[leaderboard2Styles.title, { fontFamily: 'PressStart2P' }]}>LEADERBOARD 2.0</Text>
      <View style={leaderboard2Styles.leaderboardBox}>
        <View style={leaderboard2Styles.leaderboardHeader}>
          <Text style={[leaderboard2Styles.headerText, { fontFamily: 'PressStart2P' }]}>POS</Text>
          <Text style={[leaderboard2Styles.headerText, { fontFamily: 'PressStart2P' }]}>NOME</Text>
          <Text style={[leaderboard2Styles.headerText, { fontFamily: 'PressStart2P' }]}>PUNTI</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={leaderboard}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={leaderboard2Styles.scoreItem} onLayout={index === 0 ? (e) => setItemHeight(e.nativeEvent.layout.height) : undefined}>
              <Text style={[leaderboard2Styles.scoreText, { fontFamily: 'PressStart2P' }]}>{index + 1}.</Text>
              <Text style={[leaderboard2Styles.scoreText, { fontFamily: 'PressStart2P' }]}>{item.player_name}</Text>
              <Text style={[leaderboard2Styles.scoreText, { fontFamily: 'PressStart2P' }]}>{item.score}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={{ flex: 1 }}
        />
      </View>
      <TouchableOpacity style={leaderboard2Styles.backButton} onPress={() => { if (onBack) onBack(); }}>
        <Text style={leaderboard2Styles.backButtonText}>INDIETRO</Text>
      </TouchableOpacity>
    </View>
  );
} 