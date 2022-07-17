// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {Box} from 'native-base';
// import React from 'react';

// icons
// import History from './assets/history.svg';
// import House from './assets/house.svg';
// import Person from './assets/person.svg';

// screens
export {default as Home} from './screens/home';
export {default as Account} from './screens/account';
export {default as Transactions} from './screens/transactions';

// const Tab = createBottomTabNavigator();

export default function Root() {
  //   return (
  //     <Tab.Navigator
  //       screenOptions={({route}) => ({
  //         tabBarShowLabel: false,
  //         tabBarHideOnKeyboard: true,
  //         headerTintColor: '#553044',
  //         tabBarActiveTintColor: '#622C4D',
  //         tabBarInactiveTintColor: '#622C4D',
  //         tabBarStyle: {
  //           elevation: 0,
  //           minHeight: 100,
  //           borderTopWidth: 0,
  //           backgroundColor: '#F1F1F1',
  //         },
  //         tabBarIcon: ({focused, color, size}) => {
  //           let Icon: any;
  //           switch (route.name) {
  //             case 'Home':
  //               Icon = House;
  //               break;
  //             case 'Transactions':
  //               Icon = History;
  //               break;
  //             case 'Account':
  //               Icon = Person;
  //               break;
  //           }
  //           const TabIcon = <Icon width={size} height={size} color={color} />;
  //           return focused ? (
  //             <Box borderRadius={20} bg="#FFC879" p={4}>
  //               {TabIcon}
  //             </Box>
  //           ) : (
  //             TabIcon
  //           );
  //         },
  //       })}>
  //       <Tab.Screen name="Home" component={Home} />
  //       <Tab.Screen
  //         name="Transactions"
  //         component={Transactions}
  //         options={{headerTitleStyle: {display: 'none'}}}
  //       />
  //       <Tab.Screen
  //         name="Account"
  //         component={Account}
  //         options={{headerShown: false}}
  //       />
  //     </Tab.Navigator>
  //   );
}
