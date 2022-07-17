import {useNavigation} from '@react-navigation/native';
import * as currency from '@utils/currency';
import {Box, HStack, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, Colors, Subheading, Text} from 'react-native-paper';
import {useHeaderHeight} from '@react-navigation/elements';

// icons
import Card from './assets/card.svg';

import {MoneySend, ReceiptText, Wallet} from '@exports/icons';

import {http} from '@utils/http';
import {useQuery} from 'react-query';

import * as UserStore from '@stores/user';
import NotificationBadge from '../../../components/notification_badge';

import Transaction from '../../components/transaction';

import {get_transactions} from '../../services/transaction';

type KidsResponse = {
  next: null;
  count: number;
  previous: null;
  results: unknown[];
};

type WalletResponse = {
  currency_symbol: '₦';
  provider_bank: string;
  ledger_balance: string;
  virtual_acct_name: null;
  available_balance: string;
  virtual_account_number: number;
};

const get_kids = async (): Promise<KidsResponse> => {
  return http.get('/parentapi/v1/users/kids/');
};

const get_wallet = async (): Promise<WalletResponse> => {
  const {data} = await http.get('/parentapi/v1/wallets/');
  return data;
};

const paddingY = 40;

export default function Home() {
  const nav = useNavigation();

  const headerHeight = useHeaderHeight();

  const [userState] = UserStore.useContext();

  const {first_name} = userState.context.data ?? {};

  const walletQuery = useQuery(['wallet'], get_wallet);

  const transactionsQuery = useQuery(['transactions'], get_transactions());

  const hasTransactions =
    transactionsQuery.data && transactionsQuery.data.results.length > 0;

  useEffect(() => {
    nav.setOptions({
      title: `Welcome ${first_name}!`,
      headerRight: () => (
        <HStack space={2} mr={4} alignItems="center">
          {first_name && (
            <TouchableOpacity
              onPress={() => {
                nav.navigate('Account' as any);
              }}>
              <Avatar.Text label={first_name} />
            </TouchableOpacity>
          )}

          <NotificationBadge color="white" />
        </HStack>
      ),
    });
  }, [nav, first_name]);

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      <VStack
        px={4}
        space={2}
        style={[styles.balanceCard, {paddingTop: paddingY + headerHeight}]}>
        <Subheading style={{color: '#e9e9e9'}}>WALLET BALANCE</Subheading>
        <Text style={styles.balance}>
          {currency.format(
            walletQuery.data ? parseFloat(walletQuery.data.ledger_balance) : 0,
          )}
        </Text>
      </VStack>

      <VStack p={6} space={6}>
        <VStack py={6} space={6} alignItems="center">
          <HStack space={6}>
            <TouchableOpacity
              onPress={() => nav.navigate('SendMoney' as any)}
              style={[styles.action, {backgroundColor: '#FF6600'}]}>
              <VStack space={2} alignItems="center">
                <MoneySend width={30} height={30} color="white" />
                <Text style={[styles.actionTxt, {color: 'white'}]}>Send</Text>
              </VStack>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.action, {backgroundColor: '#6D5298'}]}
              // onPress={() => nav.navigate('Topup' as any)}
            >
              <VStack space={2} alignItems="center">
                <Card width={30} height={30} color="white" />
                <Text style={styles.actionTxt}>Card</Text>
              </VStack>
            </TouchableOpacity>
          </HStack>

          <HStack space={6}>
            <TouchableOpacity
              style={[styles.action, {backgroundColor: '#4CC696'}]}>
              <VStack space={2} alignItems="center">
                <ReceiptText width={30} height={30} color="white" />
                <Text style={styles.actionTxt}>Bills</Text>
              </VStack>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.action, {backgroundColor: '#F298BB'}]}
              onPress={() => nav.navigate('FundWallet' as any)}>
              <VStack space={2} alignItems="center">
                <Wallet width={30} height={30} color="white" />
                <Text style={styles.actionTxt}>Add Money</Text>
              </VStack>
            </TouchableOpacity>
          </HStack>
        </VStack>

        <VStack space={4}>
          <HStack space={2} alignItems="center" justifyContent="space-between">
            <Subheading style={{fontStyle: 'italic'}}>
              All Transactions
            </Subheading>

            {hasTransactions && (
              <TouchableOpacity
                onPress={() => nav.navigate('Transactions' as any)}>
                <Text style={{color: '#A3A3A3'}}>View All</Text>
              </TouchableOpacity>
            )}
          </HStack>

          {hasTransactions ? (
            <VStack space={4}>
              {transactionsQuery.data.results.slice(0, 7).map(transaction => {
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
          ) : (
            <Box p={4} alignItems="center" justifyContent="center">
              <Subheading style={{color: Colors.grey400}}>
                No Transaction
              </Subheading>
            </Box>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  action: {
    padding: 24,
    minWidth: 100,
    maxWidth: 100,
    borderRadius: 10,
    justifyContent: 'center',
  },
  actionTxt: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  balance: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  balanceCard: {
    minHeight: 170,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: paddingY,
    borderBottomEndRadius: 60,
    backgroundColor: '#B6739F',
    borderBottomStartRadius: 60,
  },
});
