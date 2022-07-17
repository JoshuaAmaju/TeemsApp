import React from 'react';
import {ScrollView, StyleSheet, ScrollViewProps} from 'react-native';

export default function Screen({
  style,
  children,
  showsVerticalScrollIndicator = false,
  ...props
}: ScrollViewProps) {
  return (
    <ScrollView
      {...props}
      style={[styles.screen, style]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    // backgroundColor: '#fff',
  },
});
