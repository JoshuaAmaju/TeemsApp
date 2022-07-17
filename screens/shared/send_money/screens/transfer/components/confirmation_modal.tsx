import Button from '@components/button';
import {VStack, HStack} from 'native-base';
import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {Subheading} from 'react-native-paper';

export default function ConfirmationModal({
  style,
  onCancel,
  onConfirm,
}: ViewProps & {onCancel: () => void; onConfirm: () => void}) {
  return (
    <View style={[styles.overlay, styles.seethrough, style]}>
      <VStack
        p={8}
        w="80%"
        space={6}
        bg="#F1F1F1"
        borderRadius={10}
        alignItems="center">
        <Subheading style={styles.label}>
          Are you sure you want to continue with this transfer?
        </Subheading>

        <HStack space={2}>
          <Button mode="outlined" style={{flex: 1}} onPress={onCancel}>
            No
          </Button>

          <Button
            mode="contained"
            style={{flex: 1}}
            onPress={onConfirm}
            labelStyle={{color: '#fff'}}>
            Yes
          </Button>
        </HStack>
      </VStack>
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
  label: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
