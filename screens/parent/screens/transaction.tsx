import {useRoute} from '@react-navigation/native';
import * as currency from '@utils/currency';
import {format} from 'date-fns';
import {Box, VStack} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {useQuery} from 'react-query';

import {get_transaction} from '../services/transaction';

export default function Transaction() {
  const {id} = useRoute().params as {id: string};

  const transactionsQuery = useQuery(['transaction', id], get_transaction(id));

  if (transactionsQuery.isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  const {
    narration,
    timestamp,
    transaction_id,
    transaction_type,
    transaction_amount,
  } = transactionsQuery.data ?? {};

  const date = timestamp ? new Date(timestamp) : new Date();

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={{padding: 24}}>
      <VStack space={4}>
        <VStack space={1} style={styles.card}>
          <Text style={styles.caption}>AMOUNT</Text>
          <Text>
            {currency.format(parseFloat(transaction_amount ?? '0.0'))}
          </Text>
        </VStack>

        <VStack space={1} style={styles.card}>
          <Text style={styles.caption}>TRANSACTION TYPE</Text>

          <Text style={{textTransform: 'capitalize'}}>{transaction_type}</Text>
        </VStack>

        <VStack space={1} style={styles.card}>
          <Text style={styles.caption}>DESCRIPTION</Text>
          <Text>{narration}</Text>
        </VStack>

        <VStack space={1} style={styles.card}>
          <Text style={styles.caption}>DATE</Text>
          <Text>
            {format(date, 'PPPP')} | {format(date, 'p')}
          </Text>
        </VStack>

        <VStack space={1} style={styles.card}>
          <Text style={styles.caption}>TRANSACTION ID</Text>
          <Text>{transaction_id}</Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#E1E1E1',
    backgroundColor: '#FAFAFA',
  },
  caption: {
    fontSize: 10,
    fontWeight: '400',
  },
});
