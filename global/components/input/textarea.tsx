import React, {ComponentProps, forwardRef} from 'react';
import {TextInput as RNTextInput, StyleSheet} from 'react-native';
import {TextInput as RNPTextInput} from 'react-native-paper';

type TextInputProps = ComponentProps<typeof RNPTextInput>;

export default forwardRef<RNTextInput, TextInputProps>(function TextArea(
  {style, multiline = true, ...props},
  ref,
) {
  return (
    <RNPTextInput
      {...props}
      ref={ref}
      multiline={multiline}
      outlineColor="#E1E1E1"
      theme={{roundness: 10}}
      style={[{backgroundColor: '#FAFAFA'}, style]}
      render={attr => {
        // const style = StyleSheet.flatten(attr.style);
        return <RNTextInput {...attr} style={[attr.style, styles.container]} />;
      }}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    height: 200,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
});
