import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function PauseOverlay({
  baseStyles,
  PAUSE_TITLE_FONT_SIZE,
  PAUSE_BUTTON_PADDING_V,
  PAUSE_BUTTON_PADDING_H,
  PAUSE_BUTTON_FONT_SIZE,
  PAUSE_BUTTON_WIDTH,
  PAUSE_BUTTON_HEIGHT,
  togglePause,
  exitGame
}) {
  return (
    <View style={baseStyles.overlayContainer}>
      <Text style={[baseStyles.gameOverText, {fontFamily: 'PressStart2P', fontSize: PAUSE_TITLE_FONT_SIZE, marginBottom: 40}]}>PAUSA</Text>
      <TouchableOpacity onPress={togglePause} style={[baseStyles.restartButton, {
        paddingVertical: PAUSE_BUTTON_PADDING_V, 
        paddingHorizontal: PAUSE_BUTTON_PADDING_H, 
        marginBottom: 20,
        width: PAUSE_BUTTON_WIDTH,
        height: PAUSE_BUTTON_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
      }]}>
        <Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P', fontSize: PAUSE_BUTTON_FONT_SIZE }]}>RIPRENDI</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={exitGame} style={[baseStyles.restartButton, {
        marginTop: 20, 
        backgroundColor: '', 
        paddingVertical: PAUSE_BUTTON_PADDING_V, 
        paddingHorizontal: PAUSE_BUTTON_PADDING_H,
        width: PAUSE_BUTTON_WIDTH,
        height: PAUSE_BUTTON_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
      }]}>
        <Text style={[baseStyles.restartButtonText, { fontFamily: 'PressStart2P', fontSize: PAUSE_BUTTON_FONT_SIZE }]}>ESCI</Text>
      </TouchableOpacity>
    </View>
  );
}
