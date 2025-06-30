import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TopIcons({ onPause, onSkip, baseStyles }) {
  return (
    <View style={baseStyles.topIconsContainer}>
      <TouchableOpacity onPress={onPause} style={baseStyles.topIconButton}>
        <MaterialCommunityIcons name="pause-circle-outline" size={26} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSkip} style={baseStyles.topIconButton}>
        <MaterialCommunityIcons name="skip-next" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}