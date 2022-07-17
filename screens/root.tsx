import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Box} from 'native-base';
import React from 'react';

import * as UserStore from '@stores/user';
import {Type} from '@stores/user/types';

// icons
import History from './assets/history.svg';
import House from './assets/house.svg';
import Person from './assets/person.svg';

// screens
// import Home from './parent/screens/home';
// import Account from './parent/screens/account';
// import Transactions from './parent/screens/transactions';

import * as Kid from './kid';
import * as Parent from './parent';

const Tab = createBottomTabNavigator();

export default function Root() {
  const [userState] = UserStore.useContext();

  const {type} = userState.context;

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerTintColor: '#553044',
        tabBarActiveTintColor: '#622C4D',
        tabBarInactiveTintColor: '#622C4D',
        tabBarStyle: {
          elevation: 0,
          minHeight: 100,
          borderTopWidth: 0,
          ...(type === Type.parent && {backgroundColor: '#F1F1F1'}),
        },
        tabBarIcon: ({focused, color, size}) => {
          let Icon: any;

          switch (route.name) {
            case 'Home':
              Icon = House;
              break;

            case 'Transactions':
              Icon = History;
              break;

            case 'Account':
              Icon = Person;
              break;
          }

          const TabIcon = <Icon width={size} height={size} color={color} />;

          return focused ? (
            <Box borderRadius={20} bg="#FFC879" p={4}>
              {TabIcon}
            </Box>
          ) : (
            TabIcon
          );
        },
      })}>
      {type === Type.parent && (
        <Tab.Group>
          <Tab.Screen name="Home" component={Parent.Home} />

          <Tab.Screen
            name="Transactions"
            component={Parent.Transactions}
            options={{headerTitleStyle: {display: 'none'}}}
          />
        </Tab.Group>
      )}

      {type === Type.child && (
        <Tab.Group>
          <Tab.Screen
            name="Home"
            component={Kid.Home}
            options={{headerTransparent: true}}
          />

          <Tab.Screen
            name="Transactions"
            component={Kid.Transactions}
            options={{headerShown: false}}
          />
        </Tab.Group>
      )}

      <Tab.Screen
        name="Account"
        component={Parent.Account}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
