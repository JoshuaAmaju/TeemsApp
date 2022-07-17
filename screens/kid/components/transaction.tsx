import * as currency from '@utils/currency';
import {format} from 'date-fns';
import {Box, HStack} from 'native-base';
import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Text, Title} from 'react-native-paper';

import * as types from '@global/types/transaction';
import {Type} from '@global/types/transaction';

export default function Transaction({
  data,
  style,
  ...props
}: {data: types.Transaction} & ViewProps) {
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
      // p={4}
      {...props}
      space={6}
      bg="#fff"
      borderWidth={1}
      borderRadius={10}
      alignItems="center"
      borderColor="#C4C4C4"
      justifyContent="space-between"
      style={[{padding: 15}, style]}>
      <HStack space={2} flex={1} alignItems="center">
        <Box
          p={2}
          bg="#ADCFB9"
          borderRadius={5}
          alignItems="center"
          justifyContent="center"
          style={{width: 70, height: 70}}>
          {/* {match(transaction_type)
            .with(Type.Credit, () => (
              <ArrowLeft width={20} height={20} color="#93D824" />
            ))
            .with(Type.Debit, () => (
              <ArrowRight width={20} height={20} color="#FA802E" />
            ))
            .exhaustive()} */}
        </Box>

        <View style={{flex: 1}}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.category}>
            {transaction_category}
          </Text>

          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.caption}>
            {narration}
          </Text>
        </View>
      </HStack>

      <Box alignItems="flex-end">
        <HStack space={2} alignItems="center">
          <Title
            style={{
              fontWeight: '700',
              color: transaction_type === Type.Debit ? '#FF6600' : '#14C689',
            }}>
            {transaction_type === Type.Debit ? '+' : '-'}{' '}
            {currency.format(parseFloat(transaction_amount))}
          </Title>
        </HStack>

        <Text numberOfLines={1} style={styles.caption}>
          {format(date, 'PPPP | p')}
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
