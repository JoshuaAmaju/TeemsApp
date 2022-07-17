import {useNavigation} from '@react-navigation/native';
import {Box, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {Title} from 'react-native-paper';
import {useQuery} from 'react-query';

import {get_transactions} from '../services/transaction';

import Transaction from '../components/transaction';
import NotificationBadge from '../../components/notification_badge';

export default function Transactions() {
  const nav = useNavigation();
  const {data} = useQuery(['transactions'], get_transactions());

  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <Box mr={4}>
          <NotificationBadge />
        </Box>
      ),
    });
  }, [nav]);

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      <VStack p={6} space={4}>
        <Title>Transactions</Title>

        <VStack space={4}>
          {data?.results.map(transaction => {
            const {transaction_id} = transaction;

            return (
              <TouchableOpacity
                key={transaction_id}
                onPress={() => {
                  // @ts-ignore
                  nav.navigate('Transaction', {id: transaction_id});
                }}>
                <Transaction data={transaction} />
              </TouchableOpacity>
            );
          })}
        </VStack>
      </VStack>
    </ScrollView>
  );
}
