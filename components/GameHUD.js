import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function GameHUD({ lives, score, baseStyles }) {
  return (
    <View style={baseStyles.topInfoContainer}>
      <View style={baseStyles.livesContainer}>
        {[...Array(lives)].map((_, i) => (
          <MaterialCommunityIcons key={`heart-${i}`} name="heart" size={30} color="red" />
        ))}
      </View>
      <Text style={[baseStyles.scoreText, { fontFamily: 'PressStart2P' }]}>
        Score: {score}
      </Text>
    </View>
  );
}