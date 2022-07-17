import {format} from 'date-fns';
import {Box, HStack} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Title} from 'react-native-paper';
import {match} from 'ts-pattern';
import * as currency from '@utils/currency';

// icons
import ArrowLeft from '../assets/arrow.left.svg';
import ArrowRight from '../assets/arrow.right.svg';

import * as types from '@global/types/transaction';
import {Type} from '@global/types/transaction';

export default function Transaction({data}: {data: types.Transaction}) {
  const {
    timestamp,
    narration,
    transaction_type,
    transaction_amount,
    transaction_category,
  } = data;

  const date = new Date(timestamp);

  return (
    <HStack
      px={4}
      py={1}
      space={6}
      bg="#FAFAFA"
      borderRadius={10}
      alignItems="center"
      justifyContent="space-between">
      <HStack space={2} flex={1}>
        <Box
          p={2}
          width={10}
          height={10}
          alignItems="center"
          justifyContent="center"
          borderRadius={100}
          bg={transaction_type === Type.Debit ? '#F1C5A3' : '#E2F5C1'}>
          {match(transaction_type)
            .with(Type.Credit, () => (
              <ArrowLeft width={20} height={20} color="#93D824" />
            ))
            .with(Type.Debit, () => (
              <ArrowRight width={20} height={20} color="#FA802E" />
            ))
            .exhaustive()}
        </Box>

        <View style={{flex: 1}}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.category}>
            {transaction_category}
          </Text>

          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.caption}>
            {narration}
          </Text>
        </View>
      </HStack>

      <Box alignItems="flex-end">
        <Title style={{fontWeight: '700'}}>
          {transaction_type === Type.Debit && (
            <Text style={{fontSize: 30, color: '#FF6600'}}>- </Text>
          )}
          {currency.format(parseFloat(transaction_amount))}
        </Title>

        <Text numberOfLines={1} style={styles.caption}>
          {format(date, 'PPPP')} | {format(date, 'p')}
        </Text>
      </Box>
    </HStack>
  );
}

const styles = StyleSheet.create({
  category: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  caption: {
    fontSize: 10,
    color: '#A3A3A3',
    fontWeight: '400',
  },
});
