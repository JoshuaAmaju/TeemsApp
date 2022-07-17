import {HStack} from 'native-base';
import React, {ComponentProps, useCallback, useState} from 'react';
import {TextInput as RNTextInput} from 'react-native';
import Picker from 'react-native-date-picker';
import {
  IconButton,
  TextInput as RNPTextInput,
  useTheme,
} from 'react-native-paper';
import TextInput from '../text';
import Calendar from './assets/calendar.svg';

type PickerProps = Omit<
  ComponentProps<typeof RNPTextInput>,
  'value' | 'onChange'
> & {
  value?: Date | string;
  onChange?: (value: Date) => void;
};

export default function DatePicker({
  value,
  onChange,
  onChangeText,
  ...props
}: PickerProps) {
  const {primary} = useTheme().colors;

  const [open, setOpen] = useState(false);

  let date = typeof value === 'string' ? new Date(value) : value;

  const togglePicker = useCallback(() => setOpen(c => !c), []);

  return (
    <>
      <TextInput
        {...props}
        onFocus={togglePicker}
        value={date?.toLocaleDateString()}
        render={attr => {
          return (
            <HStack alignItems="center">
              <RNTextInput {...attr} />

              <IconButton
                size={20}
                color={primary}
                onPress={togglePicker}
                icon={({size, color}) => (
                  <Calendar width={size} height={size} color={color} />
                )}
              />
            </HStack>
          );
        }}
      />

      <Picker
        modal
        mode="date"
        open={open}
        onCancel={togglePicker}
        date={date ?? new Date()}
        onConfirm={val => {
          setOpen(false);
          onChange?.(val);
          onChangeText?.(val.toLocaleDateString());
        }}
      />
    </>
  );
}
