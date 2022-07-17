import {VStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet, ViewProps} from 'react-native';

export default function Success({style, children}: ViewProps) {
  return (
    <VStack space={8} style={[styles.overlay, styles.container, style]}>
      <Image source={require('../../assets/check.pill.png')} />
      {children}
    </VStack>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
  },
});
