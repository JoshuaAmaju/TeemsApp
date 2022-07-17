import {HStack} from 'native-base';
import React, {ComponentProps, useCallback, useState, forwardRef} from 'react';
import {TextInput as RNTextInput} from 'react-native';
import TextInput from './text';
import {EyeOff} from '@exports/icons';
import {IconButton, useTheme} from 'react-native-paper';

type PasswordInputProps = ComponentProps<typeof TextInput>;

export default forwardRef<RNTextInput, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const {primary} = useTheme().colors;
    const [isSecureEntry, setSecureEntry] = useState(true);

    const Icon = isSecureEntry ? EyeOff : EyeOff;

    const toggle = useCallback(() => {
      setSecureEntry(s => !s);
    }, []);

    return (
      <TextInput
        {...props}
        ref={ref}
        render={attr => {
          return (
            <HStack alignItems="center">
              <RNTextInput {...attr} secureTextEntry={isSecureEntry} />

              <IconButton
                color={primary}
                onPress={toggle}
                style={{marginHorizontal: 10}}
                icon={({size, color}) => (
                  <Icon width={size} height={size} color={color} />
                )}
              />
            </HStack>
          );
        }}
      />
    );
  },
);
