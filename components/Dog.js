import React from 'react';
import { Animated, Image, View } from 'react-native';

export default function Dog({
  dogImage,
  dogX,
  baseStyles,
  dogOpacityAnimation,
  dogScaleAnimation,
  shakeAnimation,
  DOG_WIDTH,
  DOG_HEIGHT,
  SCREEN_HEIGHT,
  showPowerUpAura,
  powerUpAuraOpacity,
  powerUpAuraScale,
  isPoweredUp,
  levelData,
  sidekickNameOpacityAnim,
  sidekickNameScaleAnim,
  SIDEKICK_NAME_FONT_SIZE,
  SIDEKICK_NAME_Y_OFFSET
}) {
  return (
    <>
      <Animated.Image
        source={dogImage}
        style={[
          baseStyles.dog,
          {
            left: dogX,
            opacity: dogOpacityAnimation,
            transform: [{ scale: dogScaleAnimation }, { translateX: shakeAnimation }]
          }
        ]}
        resizeMode="contain"
      />
      {/* Power-up Aura Effect */}
      {showPowerUpAura && (
        <Animated.View
          style={{
            position: 'absolute',
            left: dogX + DOG_WIDTH / 2 - (DOG_WIDTH * 1.5) / 2,
            top: SCREEN_HEIGHT - 140 + DOG_HEIGHT / 2 - (DOG_HEIGHT * 1.5) / 2,
            width: DOG_WIDTH * 1.5,
            height: DOG_HEIGHT * 1.5,
            borderRadius: (DOG_WIDTH * 1.5) / 2,
            backgroundColor: 'rgba(255, 255, 0, 0.7)',
            opacity: powerUpAuraOpacity,
            transform: [{ scale: powerUpAuraScale }],
          }}
        />
      )}
      {isPoweredUp && (
        <View style={{ position: 'absolute', left: dogX - 60, bottom: 100 }}>
          {levelData.sidekickComponent
            ? levelData.sidekickComponent()
            : levelData.sidekickImage
            ? (
              <Image
                source={levelData.sidekickImage}
                style={{
                  width: levelData.sidekickSize || DOG_WIDTH,
                  height: levelData.sidekickSize || DOG_HEIGHT,
                  resizeMode: 'contain'
                }}
              />
            )
            : null}
          {levelData.sidekickName && (
            <Animated.Text
              style={[
                baseStyles.sidekickNameText,
                {
                  fontFamily: 'PressStart2P',
                  position: 'absolute',
                  left: (levelData.sidekickSize || DOG_WIDTH) / 6 - (levelData.sidekickName.length * (SIDEKICK_NAME_FONT_SIZE / 2) / 2),
                  bottom: SIDEKICK_NAME_Y_OFFSET,
                  opacity: sidekickNameOpacityAnim,
                  transform: [{ scale: sidekickNameScaleAnim }]
                }
              ]}
            >
              {levelData.sidekickName}
            </Animated.Text>
          )}
        </View>
      )}
    </>
  );
}
