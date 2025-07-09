import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GAME_MODES } from '../utils/gameModes';
import { Audio } from 'expo-av';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import AnimatedDog2 from '../components/AnimatedDog2';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ModeChoiceScreen({ selectedMode, onSelectMode, onStart }) {
  const coin1Ref = React.useRef(null);
  const coin2Ref = React.useRef(null);
  const musicRef = React.useRef(null);
  
  // STATI
  const [fontsLoaded] = useFonts({ 'PressStart2P': PressStart2P_400Regular });
  const [soundsReady, setSoundsReady] = React.useState(false);

  // EFFETTO PER CARICARE I SUONI
  React.useEffect(() => {
    let isMounted = true;
    async function loadSounds() {
      try {
        console.log("[ModeChoiceScreen] Inizio caricamento suoni...");
        
        const { sound: coin1 } = await Audio.Sound.createAsync(require('../assets/sounds/coin1.mp3'));
        if (isMounted) {
            console.log("[ModeChoiceScreen] Suono coin1.mp3 caricato.");
            coin1Ref.current = coin1;
        }

        const { sound: coin2 } = await Audio.Sound.createAsync(require('../assets/sounds/coin2.mp3'));
        if (isMounted) {
            console.log("[ModeChoiceScreen] Suono coin2.mp3 caricato.");
            coin2Ref.current = coin2;
        }
        
        if (isMounted) {
          console.log("[ModeChoiceScreen] Tutti i suoni sono pronti.");
          setSoundsReady(true);
        }

      } catch (e) {
        console.error("ERRORE CRITICO: Impossibile caricare i suoni. Verifica che i file .mp3 esistano nel percorso corretto ('../assets/sounds/').", e);
      }
    }
    loadSounds();
    
    // Funzione di pulizia che viene eseguita quando il componente viene smontato
    return () => {
      isMounted = false;
      console.log("[ModeChoiceScreen] Componente smontato.");
      // --- MODIFICA CHIAVE ---
      // Le righe seguenti sono state commentate. In questo modo, quando si cambia schermata,
      // il suono ha il tempo di essere riprodotto e non viene interrotto bruscamente.
      // Per un'app molto grande, sarebbe meglio gestire l'audio a livello globale (in App.js),
      // ma per questo caso specifico questa soluzione è efficace e sicura.
      // coin1Ref.current?.unloadAsync();
      // coin2Ref.current?.unloadAsync();
    };
  }, []); // L'array vuoto assicura che questo effetto venga eseguito solo una volta

  // Musica di sottofondo destiny.mp3
  React.useEffect(() => {
    let isMounted = true;
    async function loadMusic() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/levels/destiny.mp3'),
          { shouldPlay: true, isLooping: true, volume: 0.5 }
        );
        if (isMounted) musicRef.current = sound;
      } catch (e) {}
    }
    loadMusic();
    return () => {
      isMounted = false;
      if (musicRef.current) {
        musicRef.current.stopAsync();
        musicRef.current.unloadAsync();
        musicRef.current = null;
      }
    };
  }, []);

  // GESTORE PER LA SELEZIONE DELLA MODALITÀ
  const handleModeSelect = async (mode) => {
    if (!soundsReady) return;
    try {
      await coin2Ref.current?.replayAsync();
    } catch (e) {
      console.error("Errore durante la riproduzione di coin2:", e);
    }
    onSelectMode(mode);
  };

  // GESTORE PER LA PRESSIONE DEL TASTO START
  const handleStartPress = async () => {
    if (!soundsReady) return;
    try {
      await coin1Ref.current?.replayAsync();
    } catch (e) {
      console.error("Errore durante la riproduzione di coin1:", e);
    }
    // Il ritardo aiuta a garantire che l'utente percepisca il suono prima del cambio di schermata
    setTimeout(() => {
        onStart && onStart();
    }, 150);
  };
  
  if (!fontsLoaded) {
      return (
          <View style={styles.container}>
              <Text style={styles.loadingText}>Caricamento...</Text>
          </View>
      )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.explanation}>
        Scegli la modalità di gioco:
        {'\n'}
       
      </Text>
      <View style={styles.modeChoiceContainer}>
        {GAME_MODES.map(mode => (
          <TouchableOpacity
            key={mode.key}
            disabled={!soundsReady}
            style={[
                styles.modeChoiceButton, 
                selectedMode === mode.key && styles.modeChoiceButtonSelected,
                !soundsReady && styles.buttonDisabled 
            ]}
            onPress={() => handleModeSelect(mode.key)}
          >
            <Text style={[styles.modeChoiceText, selectedMode === mode.key && styles.modeChoiceTextSelected]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <AnimatedDog2 size={280} />
      {selectedMode && (
        <TouchableOpacity 
            disabled={!soundsReady}
            style={[
                styles.startButton,
                !soundsReady && styles.buttonDisabled
            ]} 
            onPress={handleStartPress}
        >
          <Text style={styles.startButtonText}>
            {soundsReady ? 'START' : 'CARICO...'}
          </Text>
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
  loadingText: {
      color: 'white',
      fontFamily: 'PressStart2P',
      fontSize: 16,
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
  buttonDisabled: {
      opacity: 0.5,
  }
});
