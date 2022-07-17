import {Box, HStack, VStack} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Caption,
  Colors,
  Subheading,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';

import Button from '@global/components/button';
import Screen from '@global/components/screen';
import {http} from '@global/utils/http';
import {useNavigation} from '@react-navigation/native';
import * as currency from '@utils/currency';
import {format} from 'date-fns';
import {useQuery} from 'react-query';

import Transaction from '@screens/kid/components/transaction';

import {Category} from '@global/types/transaction';
import PlusIcon from './plus.svg';

enum Status {
  block = 'block',
  unblock = 'un-block',
}

const get_wallet = async (): Promise<any> => {
  const {data} = await http.get('/parentapi/v1/wallets/');
  return data;
};

const get_transactions = async (kid_code: string): Promise<any> => {
  const res = await http.get(
    `/parentapi/v1/users/kid-transactions/${kid_code}/`,
  );
  return res;
};

export default function KidSummary() {
  const {accent} = useTheme().colors;

  const nav = useNavigation();

  // const {kid} = useRoute().params as {kid: string};

  const walletQuery = useQuery(['wallet'], get_wallet);

  // const trnxQuery = useQuery(['kid_transactions'], () => get_transactions(kid));

  // const blockMutation = useMutation<any, any, Status>(async status => {
  //   http.post('/parentapi/v1/users/block-unblock-kid/', {status, kid_code: 1});
  // });

  const date = new Date();

  return (
    <Screen>
      <VStack space={4}>
        <View>
          <VStack space={4} style={{padding: 24}}>
            <VStack space={2} style={styles.balanceCard}>
              <Subheading style={{color: '#e9e9e9'}}>WALLET BALANCE</Subheading>
              <Text style={styles.balance}>
                {currency.format(
                  walletQuery.data
                    ? parseFloat(walletQuery.data.ledger_balance)
                    : 0,
                )}
              </Text>
            </VStack>

            <View>
              <HStack space={2} style={styles.tile}>
                <Subheading>Last Log in:</Subheading>
                <Text>{format(date, 'dd/MM/yyyy | p')}</Text>
              </HStack>

              <HStack space={2} style={styles.tile}>
                <Subheading>Temporary Restriction</Subheading>
                <Switch value={true} />
              </HStack>

              <HStack space={2} style={styles.tile}>
                <Subheading>Block Account</Subheading>
                <Switch value={true} />
              </HStack>
            </View>

            <HStack space={2} style={[styles.tile, {paddingVertical: 0}]}>
              <Button
                compact
                labelStyle={styles.btnLabel}
                color={accent}
                onPress={() => {
                  // @ts-ignore
                  nav.navigate('CreateAllowance', {kid: 1});
                }}>
                Set Allowance
              </Button>

              <Button
                compact
                labelStyle={styles.btnLabel}
                onPress={() => {
                  // @ts-ignore
                  nav.navigate('CreateSpendingLimit', {kid: 1});
                }}>
                Set spending Limit
              </Button>
            </HStack>
          </VStack>

          <ScrollView
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 10,
            }}>
            <HStack space={4}>
              <VStack
                space={2}
                alignItems="center"
                style={styles.chore}
                borderStyle="dashed"
                justifyContent="center">
                <PlusIcon width={15} height={15} color="#000" />
                <Caption>Add new chores</Caption>
              </VStack>

              {new Array(10).fill(0).map((_, i) => {
                return <Box key={i} style={[styles.chore, {width: 120}]} />;
              })}
            </HStack>
          </ScrollView>
        </View>

        <VStack space={4} style={{paddingHorizontal: 24}}>
          <Subheading>All Transactions</Subheading>

          <View>
            {new Array(10).fill(0).map((_, i) => (
              <Transaction
                key={i}
                style={{borderWidth: 0, paddingHorizontal: 0}}
                data={{
                  fees: '',
                  narration: 'jhgfg',
                  recipient_account_name: 'hjgfg',
                  recipient_account_number: 'jkgf',
                  timestamp: date.toJSON(),
                  transaction_amount: '500',
                  transaction_category: Category.SentMoney,
                  transaction_id: 'jgkf',
                  transaction_status: '',
                  transaction_type: 'jhgf',
                  transaction_reference: 'hfkjgf',
                }}
              />
            ))}
          </View>

          {/* <FlatList
            data={new Array(10).fill(0)}
            ItemSeparatorComponent={() => <Box h={4} />}
            contentContainerStyle={{paddingHorizontal: 24}}
            renderItem={() => (
              <Transaction
                style={{borderWidth: 0, paddingHorizontal: 0}}
                data={{
                  fees: '',
                  narration: 'jhgfg',
                  recipient_account_name: 'hjgfg',
                  recipient_account_number: 'jkgf',
                  timestamp: date.toJSON(),
                  transaction_amount: '500',
                  transaction_category: Category.SentMoney,
                  transaction_id: 'jgkf',
                  transaction_status: '',
                  transaction_type: 'jhgf',
                  transaction_reference: 'hfkjgf',
                }}
              />
            )}
          /> */}
        </VStack>
      </VStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    margin: 15,
    minHeight: 170,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B6739F',
  },
  balance: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  tile: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    // flex: 1,
  },
  btnLabel: {
    fontSize: 12,
  },
  chore: {
    minHeight: 130,
    borderWidth: 1,
    borderRadius: 9,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: Colors.grey300,
  },
});
