import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HowToScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>COME SI GIOCA</Text>
      <Text style={styles.instructions}>
        • Muovi il cane con il joystick o i tasti direzionali.
        {"\n"}
        • Spara la cacca per colpire i nemici!
        {"\n"}
        • Prendi i power-up per bonus speciali.
        {"\n"}
        • Evita i proiettili e non farti toccare dai nemici.
        {"\n"}
        • Vinci il livello eliminando tutti i nemici!
      </Text>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>INDIETRO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: 'cyan',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  instructions: {
    color: 'white',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 28,
  },
  backButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'cyan',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 