import React, {ComponentProps, forwardRef} from 'react';
import {TextInput as RNTextInput} from 'react-native';
import {TextInput as RNPTextInput} from 'react-native-paper';

type TextInputProps = ComponentProps<typeof RNPTextInput>;

export default forwardRef<RNTextInput, TextInputProps>(function TextInput(
  {style, ...props},
  ref,
) {
  return (
    <RNPTextInput
      {...props}
      ref={ref}
      outlineColor="#E1E1E1"
      theme={{roundness: 10}}
      style={[{backgroundColor: '#FAFAFA'}, style]}
    />
  );
});
