// styles/GameStyle.js – Stili e costanti per il gioco, ora con log diagnostici

import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SIDEKICK_NAME_FADE_IN_DURATION = 300;
export const SIDEKICK_NAME_HOLD_DURATION = 1000;
export const SIDEKICK_NAME_FADE_OUT_DURATION = 500;
export const SIDEKICK_NAME_INITIAL_SCALE = 6.5; 
export const SIDEKICK_NAME_FINAL_SCALE = 2.0;  
export const SIDEKICK_NAME_Y_OFFSET = 150; 
export const SIDEKICK_NAME_FONT_SIZE = 10; 
export const SIDEKICK_NAME_COLOR = 'yellow'; 

// --- DEBUG: Logga il valore della costante quando il modulo GameStyle.js viene caricato ---
//console.log("GameStyle.js loaded. SIDEKICK_NAME_INITIAL_SCALE is:", SIDEKICK_NAME_INITIAL_SCALE);
// --- FINE DEBUG ---

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    opacity: 0.6,
  },
  dog: {
    position: 'absolute',
    bottom: 120,
    width: 180,
    height: 160,
  },
  poop: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  enemy: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  particle: {
    position: 'absolute',
    borderRadius: 10,
  },
  topInfoContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  livesContainer: {
    flexDirection: 'row',
  },
  scoreText: {
    color: 'white',
    fontSize: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 15,
  },
  topIconsContainer: {
    position: 'absolute',
    top: 50,
    right: 15,
    flexDirection: 'row',
  },
  topIconButton: {
    padding: 6,
    marginLeft: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
  },
  bottomControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: 120,
    flexDirection: 'row',
    width: '100%',
  },
  moveArea: {
    width: '70%',
    height: '100%',
   backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  fireArea: {
    width: '30%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireButton: {
    width: 100, height: 100,
    backgroundColor: '#b30000',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#ff4d4d',
    elevation: 8,
  },
  fireButtonText: {
    color: 'white',
    fontSize: 16,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0, left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameOverText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  finalScoreText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  restartButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sidekickNameText: {
    position: 'absolute',
    color: SIDEKICK_NAME_COLOR,
    fontSize: SIDEKICK_NAME_FONT_SIZE,
   // backgroundColor: 'rgb(255, 251, 251)',
    paddingHorizontal: 40,
    paddingVertical: 100,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default styles;
