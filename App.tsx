import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import FlashMessage from 'react-native-flash-message';

import BackButton from '@components/backbutton';

// screens
import Root from '@screens/root';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            contentStyle: {backgroundColor: '#fff'},
            headerLeft: props => props.canGoBack && <BackButton />,
          }}>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{
              headerShown: false,
              // contentStyle: {backgroundColor: '#fff'},
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage />
    </>
  );
};

export default App;
