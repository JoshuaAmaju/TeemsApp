import {ComponentProps} from 'react';
import {StyleSheet} from 'react-native';
import {Button as RNPButton, Colors} from 'react-native-paper';
import React from 'react';

type ButtonProps = ComponentProps<typeof RNPButton>;

export default function Button({
  style,
  theme,
  labelStyle,
  mode = 'contained',
  ...props
}: ButtonProps) {
  return (
    <RNPButton
      {...props}
      mode={mode}
      style={[styles.btn, style]}
      labelStyle={[mode === 'contained' && {color: Colors.white}, labelStyle]}
      theme={{...theme, roundness: 5}}
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 10,
  },
});
