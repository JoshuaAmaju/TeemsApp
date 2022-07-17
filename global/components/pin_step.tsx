import Button from '@global/components/button';
import Pin from '@global/components/input/pin';
import {VStack} from 'native-base';
import React from 'react';
import {StyleSheet, TextInputProps, View} from 'react-native';
import {Caption, Title} from 'react-native-paper';

export default function PinEntry({
  value,
  error,
  onSubmit,
  onChangeText,
  onSubmitEditing,
}: TextInputProps & {error?: string; onSubmit: () => void}) {
  return (
    <View style={[styles.overlay, styles.pin]}>
      <VStack space={6} w="100%" alignItems="center">
        <Title style={styles.label}>Enter wallet pin</Title>

        <VStack space={3}>
          <Pin
            value={value}
            keyboardType="number-pad"
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
          />

          <Caption style={{color: 'red'}}>{error}</Caption>
        </VStack>
      </VStack>

      <Button
        mode="contained"
        style={styles.btn}
        onPress={onSubmit}
        labelStyle={styles.btnLabel}>
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  label: {
    textTransform: 'uppercase',
  },
  btn: {
    minWidth: '70%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  btnLabel: {
    color: '#fff',
  },
});
