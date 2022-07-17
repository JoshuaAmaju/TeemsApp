import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Root from './screens/root';
import Change from './screens/change_pin_or_password';
import EditProfile from './screens/edit_profile';

import BackButton from '@components/backbutton';

const Stack = createNativeStackNavigator();

export default function Account() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerLeft: props => props.canGoBack && <BackButton />,
      }}>
      <Stack.Screen name="Root" component={Root} options={{title: 'Account'}} />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{title: 'Edit Profile'}}
      />

      <Stack.Screen
        name="Change"
        component={Change}
        options={({route}) => ({
          title: `Change ${(route.params as any).type}`,
        })}
      />
    </Stack.Navigator>
  );
}
