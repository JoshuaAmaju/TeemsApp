import {useNavigation} from '@react-navigation/native';
import {HStack, VStack} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Subheading} from 'react-native-paper';
import {ChevronRight} from '@exports/icons';

const SCREENS = [
  {
    type: 'bank_transfer',
    label: 'Bank Transfer',
  },
  {
    type: 'request',
    label: 'Request money from your parent',
  },
];

export default function FundWallet() {
  const nav = useNavigation();

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={{padding: 24}}>
      <VStack space={4}>
        {SCREENS.map((s, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                // @ts-ignore
                nav.navigate('FundWalletDetails', {type: s.type});
              }}>
              <HStack space={1} style={styles.card}>
                <Subheading>{s.label}</Subheading>
                <ChevronRight width={15} height={15} color="#31031CCC" />
              </HStack>
            </TouchableOpacity>
          );
        })}
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: 'center',
    paddingHorizontal: 20,
    borderColor: '#E1E1E1',
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
  },
});
