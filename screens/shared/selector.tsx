import {useNavigation} from '@react-navigation/native';
import {Box, VStack} from 'native-base';
import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Headline, Text, useTheme} from 'react-native-paper';

import * as UserStore from '@stores/user';
import {Type} from '@stores/user/types';

import * as OnboardingStore from '@stores/onboarding';

const TYPES: {value: Type; label: string}[] = [
  {
    label: 'Child',
    value: Type.child,
  },
  {
    value: Type.parent,
    label: 'Parent/Guardian',
  },
];

export default function TypeSelector() {
  const nav = useNavigation();
  const {primary} = useTheme().colors;
  // const userType = UserType.store(UserType.typeSelector)
  // const onboarded = Onboarding.store(Onboarding.selector)

  const [userState, send] = UserStore.useContext();
  const [onboardingState] = OnboardingStore.useContext();

  const userType = userState.context.type;
  const onboarded = onboardingState.matches(OnboardingStore.State.onboarded);

  const onPress = useCallback<(type: Type) => void>(
    type => {
      send({type: UserStore.Action.setType, data: {type}});
      nav.navigate(onboarded ? 'Login' : ('Signup' as any));
      // nav.navigate('Login');
    },
    [send, nav, onboarded],
  );

  return (
    <VStack p={4} mt="30%" space={16}>
      <VStack space={1}>
        <Headline>Continue As</Headline>
        <Text>Please tap on the box that best suits you</Text>
      </VStack>

      <VStack space={9}>
        {TYPES.map((type, i) => {
          const selected = userType === type.value;

          return (
            <TouchableOpacity key={i} onPress={() => onPress(type.value)}>
              <Box
                p={4}
                key={i}
                borderRadius={10}
                alignItems="center"
                justifyContent="center"
                style={[
                  selected ? {backgroundColor: primary} : styles.outline,
                ]}>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: '700',
                    color: selected ? 'white' : 'black',
                  }}>
                  {type.label}
                </Text>
              </Box>
            </TouchableOpacity>
          );
        })}
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: Colors.grey400,
  },
});
