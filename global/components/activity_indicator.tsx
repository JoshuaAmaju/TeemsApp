import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator as RNPActivityIndicator} from 'react-native-paper';

export default function ActivityIndicator() {
  return (
    <View style={[styles.overlay, styles.seethrough]}>
      <RNPActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seethrough: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});
