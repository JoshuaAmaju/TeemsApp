import {useNavigation} from '@react-navigation/native';
import * as currency from '@utils/currency';
import {Box, HStack, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Avatar,
  Caption,
  Colors,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';

// icons
import CardAdd from './assets/card-add.svg';
import Plus from './assets/plus.svg';

import {MoneySend, ReceiptText, Wallet} from '@exports/icons';

import {http} from '@utils/http';
import {useQuery} from 'react-query';

import * as UserStore from '@stores/user';
import NotificationBadge from '../../../components/notification_badge';

import {Color} from '@global/utils/style';
import Transaction from '../../components/transaction';
import {get_transactions} from '../../services/transaction';
import {get_kids} from '@screens/services/kid';

// type KidsResponse = {
//   next: null;
//   count: number;
//   previous: null;
//   results: unknown[];
// };

type WalletResponse = {
  currency_symbol: '₦';
  provider_bank: string;
  ledger_balance: string;
  virtual_acct_name: null;
  available_balance: string;
  virtual_account_number: number;
};

// const get_kids = async (): Promise<KidsResponse> => {
//   return http.get('/parentapi/v1/users/kids/');
// };

const get_wallet = async (): Promise<WalletResponse> => {
  const {data} = await http.get('/parentapi/v1/wallets/');
  return data;
};

export default function Home() {
  const nav = useNavigation();

  const [userState] = UserStore.useContext();

  const {bvn_verified = true, first_name} = userState.context.data ?? {};

  const kidsQuery = useQuery(['kids'], get_kids);

  const walletQuery = useQuery(['wallet'], get_wallet);

  const transactionsQuery = useQuery(['transactions'], get_transactions());

  const hasTransactions =
    transactionsQuery.data && transactionsQuery.data.results.length > 0;

  useEffect(() => {
    nav.setOptions({
      title: `Welcome ${first_name}!`,
      headerRight: () => <NotificationBadge />,
    });
  }, [nav, first_name]);

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingVertical: 24}}>
      <VStack space={6}>
        <VStack space={6}>
          <HStack px={6} space={4}>
            <Box
              borderWidth={1}
              alignItems="center"
              style={styles.round}
              borderColor="#C5C5C4"
              justifyContent="center">
              {/* <Avatar.Image size={50} source={require(PATH)} /> */}

              <Box
                p={2}
                size="80%"
                borderRadius={100}
                alignItems="center"
                bg={Color.bitterSweet}
                justifyContent="center">
                <Caption style={{color: 'white'}}>Add New</Caption>
              </Box>

              <Box
                p={2}
                right={0}
                bottom={0}
                bg="white"
                borderRadius={100}
                position="absolute"
                style={{elevation: 2}}>
                <Plus width={10} height={10} color="black" />
              </Box>
            </Box>

            {kidsQuery.data?.results.map(kid => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    // @ts-ignore
                    nav.navigate('KidSummary', {kid: 1});
                  }}>
                  <Avatar.Text label="Kid" />
                </TouchableOpacity>
              );
            })}

            {/* <Avatar.Image source={require(PATH)} />
            <Avatar.Image source={require(PATH)} />
            <Avatar.Image source={require(PATH)} /> */}
          </HStack>

          <VStack space={8}>
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

            {bvn_verified ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 24}}>
                <HStack space={3}>
                  <TouchableOpacity
                    onPress={() => nav.navigate('SendMoney' as any)}
                    style={[styles.action, {backgroundColor: '#FF6600'}]}>
                    <VStack space={2} alignItems="center">
                      <MoneySend width={30} height={30} color="white" />
                      <Text style={[styles.actionTxt, {color: 'white'}]}>
                        Send
                      </Text>
                    </VStack>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.action, styles.outline]}
                    onPress={() => nav.navigate('Topup' as any)}>
                    <VStack space={2} alignItems="center">
                      <CardAdd width={30} height={30} color="black" />
                      <Text style={styles.actionTxt}>Topup</Text>
                    </VStack>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.action, styles.outline]}>
                    <VStack space={2} alignItems="center">
                      <ReceiptText width={30} height={30} color="black" />
                      <Text style={styles.actionTxt}>Bills</Text>
                    </VStack>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.action, styles.outline]}
                    onPress={() => nav.navigate('FundWallet' as any)}>
                    <VStack space={2} alignItems="center">
                      <Wallet width={30} height={30} color="black" />
                      <Text style={styles.actionTxt}>Fund wallet</Text>
                    </VStack>
                  </TouchableOpacity>
                </HStack>
              </ScrollView>
            ) : (
              <TouchableOpacity
                onPress={() => nav.navigate('VerifyBVN' as any)}>
                <Box p={4} m={4} bg="red.600" borderRadius={10}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                      textDecorationLine: 'underline',
                    }}>
                    Please verify your BVN
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
          </VStack>
        </VStack>

        <VStack px={6} space={4}>
          <HStack space={2} alignItems="center" justifyContent="space-between">
            <Title>Transactions</Title>

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
              <Title style={{color: Colors.grey400}}>No Transaction</Title>
            </Box>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  round: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  action: {
    padding: 24,
    minWidth: 90,
    maxWidth: 100,
    borderRadius: 20,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
  },
  actionTxt: {
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
  },
  caption: {
    fontSize: 10,
    color: '#A3A3A3',
    fontWeight: '400',
  },
  balance: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  balanceCard: {
    marginHorizontal: 24,
    backgroundColor: '#B6739F',
    minHeight: 170,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
