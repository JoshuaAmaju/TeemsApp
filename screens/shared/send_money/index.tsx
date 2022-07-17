import {useNavigation} from '@react-navigation/native';
import {HStack, VStack} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Subheading, Title} from 'react-native-paper';
import InterBank from './assets/bank-transfer.svg';
import Transfer from './assets/transfer.svg';
import Wallet from './assets/wallet-to-wallet.svg';

import {Type} from './types';

const screens = [
  {
    type: Type.interbank,
    label: 'Inter Bank Transfer',
  },
  {
    label: 'Wallet to Wallet',
    type: Type.wallet_to_wallet,
  },
  {
    type: Type.parent_to_kid,
    label: 'Parent to kids Transfer',
  },
];

export default function SendMoney() {
  const nav = useNavigation();

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={{padding: 24}}>
      <VStack space={6}>
        <Title>How would you like to send money?</Title>

        <VStack space={4}>
          {screens.map((s, i) => {
            const Icon =
              s.type === Type.interbank
                ? InterBank
                : s.type === Type.wallet_to_wallet
                ? Wallet
                : Transfer;

            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  // if (s.type === Type.parent_to_kid) {
                  //   nav.navigate('Recipient' as any);
                  // } else {
                  //   // @ts-ignore
                  //   nav.navigate('Transfer', {type: s.type});
                  // }

                  if (s.type === Type.interbank) {
                    nav.navigate('InterbankTransfer' as any);
                  }

                  if (s.type === Type.wallet_to_wallet) {
                    nav.navigate('WalletToWallet' as any);
                  }

                  if (s.type === Type.parent_to_kid) {
                    nav.navigate('Recipient' as any);
                  }
                }}>
                <HStack space={1} style={styles.card}>
                  <Subheading style={{color: '#31031C', fontWeight: '700'}}>
                    {s.label}
                  </Subheading>
                  <Icon width={30} height={30} color="#000" />
                </HStack>
              </TouchableOpacity>
            );
          })}
        </VStack>
      </VStack>
    </ScrollView>
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
