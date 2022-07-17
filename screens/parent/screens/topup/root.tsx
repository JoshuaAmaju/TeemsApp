import {useNavigation} from '@react-navigation/native';
import {HStack, VStack} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Subheading, Title} from 'react-native-paper';
import {ChevronRight} from '@exports/icons';

import {Type} from './types';

const screens = [
  {
    label: 'Airtime',
    value: Type.airtime,
  },
  {
    label: 'Data Bundle',
    value: Type.dataBundle,
  },
];

export default function Topup() {
  const nav = useNavigation();

  return (
    <VStack flex={1} p={6} space={6} bg="#fff">
      <Title>What would you like to pay for?</Title>

      <VStack space={4}>
        {screens.map(s => (
          <TouchableOpacity
            key={s.value}
            onPress={() => {
              // @ts-ignore
              nav.navigate('Bundle', {type: s.value});
            }}>
            <HStack space={1} style={styles.card}>
              <Subheading>{s.label}</Subheading>
              <ChevronRight width={15} height={15} color="#31031CA6" />
            </HStack>
          </TouchableOpacity>
        ))}
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
    justifyContent: 'space-between',
  },
});
