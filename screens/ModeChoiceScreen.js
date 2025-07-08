import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GAME_MODES } from '../utils/gameModes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ModeChoiceScreen({ selectedMode, onSelectMode, onStart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.explanation}>
        Scegli la modalità di gioco:
        {'\n'}
        - Zen: rilassata, pochi nemici
        {'\n'}- Normal: classica
        {'\n'}- Advanced: per esperti
        {'\n'}- Panic: massima difficoltà!
      </Text>
      <View style={styles.modeChoiceContainer}>
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
      {selectedMode && (
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  explanation: {
    color: 'white',
    fontFamily: 'PressStart2P',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modeChoiceContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  modeChoiceButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeChoiceButtonSelected: {
    backgroundColor: '#ffe600',
    borderColor: '#ffe600',
  },
  modeChoiceText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PressStart2P',
  },
  modeChoiceTextSelected: {
    color: '#222',
  },
  startButton: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#ffe600',
    borderRadius: 10,
    alignItems: 'center',
    width: 180,
  },
  startButtonText: {
    color: '#222',
    fontFamily: 'PressStart2P',
    fontSize: 16,
  },
}); 