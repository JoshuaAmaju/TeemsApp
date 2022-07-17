import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import FlashMessage from 'react-native-flash-message';
import {NativeBaseProvider, extendTheme} from 'native-base';
import {
  DefaultTheme,
  Provider as ReactNativePaperProvider,
} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from 'react-query';

import * as UserStore from '@stores/user';
import * as OnboardingStore from '@stores/onboarding';

import BackButton from '@components/backbutton';

// screens
import Root from '@screens/root';
import Transaction from '@screens/parent/screens/transaction';
import Notifications from '@screens/parent/screens/notifications';

import Login from '@screens/shared/login';
import Signup from '@screens/shared/signup';
import Onboarding from '@screens/shared/onboarding';
import TypeSelector from '@screens/shared/selector';

import FundWallet from '@screens/shared/fund_wallet';
import FundWalletDetails from '@screens/shared/fund_wallet/details';

import Topup from '@screens/parent/screens/topup/root';
import Bundle from '@screens/parent/screens/topup/bundle';

import CreateChore from '@screens/parent/screens/create_chore';
import CreateAllowance from '@screens/parent/screens/create_allowance';
import CreateSpendingLimit from '@screens/parent/screens/create_spending_limit';

import SendMoney from '@screens/shared/send_money';
// import Transfer from '@screens/shared/send_money/screens/transfer';
import TransferRecipient from '@screens/shared/send_money/screens/recipient';

import InterbankTransfer from '@screens/shared/send_money/screens/transfer/interbank_section';
import WalletToWalletTransfer from '@screens/shared/send_money/screens/transfer/wallet_section';
import ParentToKidTransfer from '@screens/shared/send_money/screens/transfer/parent_to_kid';
import KidSummary from '@screens/parent/screens/home/kid_summary';

const lighTheme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FA802E',
    accent: '#B6739F',
  },
};

const Stack = createNativeStackNavigator();

const App = () => {
  const [userState] = UserStore.useContext();
  const [onboardingState] = OnboardingStore.useContext();

  // const {bvn_verified} = userState.context.data ?? {};

  // console.log(userState.context.token);

  const authenticated = userState.matches(UserStore.State.authenticated);
  const onboarded = onboardingState.matches(OnboardingStore.State.onboarded);

  return (
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: {
              enabled: authenticated,
            },
          },
        })
      }>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            contentStyle: {backgroundColor: '#fff'},
            headerLeft: props => props.canGoBack && <BackButton />,
          }}>
          <Stack.Group screenOptions={{headerShown: false}}>
            {authenticated ? (
              <Stack.Group
                screenOptions={{
                  headerShown: true,
                  contentStyle: {backgroundColor: '#fff'},
                }}>
                <Stack.Screen
                  name="Root"
                  component={Root}
                  options={{
                    headerShown: false,
                    // contentStyle: {backgroundColor: '#fff'},
                  }}
                />

                <Stack.Screen
                  name="Transaction"
                  component={Transaction}
                  options={{title: 'Transaction details'}}
                />

                <Stack.Screen name="Notifications" component={Notifications} />

                <Stack.Group screenOptions={{title: 'Send Money'}}>
                  <Stack.Screen name="SendMoney" component={SendMoney} />

                  <Stack.Screen
                    name="InterbankTransfer"
                    component={InterbankTransfer}
                    options={{title: 'Transfer'}}
                  />

                  <Stack.Screen
                    name="WalletToWallet"
                    component={WalletToWalletTransfer}
                    options={{title: 'Transfer'}}
                  />

                  <Stack.Screen
                    name="ParentToKid"
                    component={ParentToKidTransfer}
                    options={{title: 'Send Money'}}
                  />

                  {/* <Stack.Screen
                    name="Transfer"
                    component={Transfer}
                    options={{title: 'Transfer'}}
                  /> */}

                  <Stack.Screen
                    name="Recipient"
                    component={TransferRecipient}
                  />
                </Stack.Group>

                <Stack.Group screenOptions={{title: 'Fund Wallet'}}>
                  <Stack.Screen name="FundWallet" component={FundWallet} />

                  <Stack.Screen
                    name="FundWalletDetails"
                    component={FundWalletDetails}
                  />
                </Stack.Group>

                <Stack.Group>
                  <Stack.Screen
                    name="Topup"
                    component={Topup}
                    options={{title: 'Top up'}}
                  />

                  <Stack.Screen
                    name="Bundle"
                    component={Bundle}
                    options={({route}) => ({
                      title: (route.params as any).type,
                    })}
                  />
                </Stack.Group>

                <Stack.Screen name="KidSummary" component={KidSummary} />

                <Stack.Screen
                  name="CreateChore"
                  component={CreateChore}
                  options={{title: 'Create Chore'}}
                />

                <Stack.Screen
                  name="CreateAllowance"
                  component={CreateAllowance}
                  options={{title: 'Set Allowance'}}
                />

                <Stack.Screen
                  name="CreateSpendingLimit"
                  component={CreateSpendingLimit}
                  options={{title: 'Spending Limit'}}
                />
              </Stack.Group>
            ) : (
              <>
                {!onboarded && (
                  <Stack.Screen name="Onboarding" component={Onboarding} />
                )}

                <Stack.Screen name="TypeSelector" component={TypeSelector} />

                <Stack.Screen name="Login" component={Login} />

                <Stack.Screen name="Signup" component={Signup} />
              </>
            )}

            {/* <Stack.Screen
              name="Root"
              component={Root}
              options={
                {
                  // headerShown: false,
                  // contentStyle: {backgroundColor: '#fff'},
                }
              }
            /> */}
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage />
    </QueryClientProvider>
  );
};

const theme = extendTheme({
  colors: {
    brand: {},
  },
});

export default function main() {
  return (
    <NativeBaseProvider theme={theme}>
      <ReactNativePaperProvider theme={lighTheme}>
        <OnboardingStore.Provider value={OnboardingStore.create()}>
          <UserStore.Provider value={UserStore.service}>
            {/* <QueryClientProvider client={new QueryClient()}> */}
            <App />
            {/* </QueryClientProvider> */}
          </UserStore.Provider>
        </OnboardingStore.Provider>
      </ReactNativePaperProvider>
    </NativeBaseProvider>
  );
}
