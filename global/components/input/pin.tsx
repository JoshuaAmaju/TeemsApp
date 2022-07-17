import React from 'react';

import {StyleProp, StyleSheet, TextInputProps, ViewStyle} from 'react-native';
import {useTheme, Colors} from 'react-native-paper';

// @ts-ignore
import OTPTextView from 'react-native-otp-textinput';

type Props = {
  length: number;
  tintColor: string;
  contentStyle: StyleProp<ViewStyle>;
  containerStyle: StyleProp<ViewStyle>;
};

export default function Pin({
  value,
  tintColor,
  length = 4,
  onChangeText,
  contentStyle,
  containerStyle,
  keyboardType = 'numeric',
  ...props
}: TextInputProps & Partial<Props>) {
  const {primary} = useTheme().colors;

  return (
    <OTPTextView
      {...props}
      inputCount={length}
      defaultValue={value}
      keyboardType={keyboardType}
      containerStyle={containerStyle}
      handleTextChange={onChangeText}
      tintColor={tintColor ?? primary}
      textInputStyle={[styles.input, contentStyle]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: Colors.grey300,
    backgroundColor: Colors.grey50,
  },
});
