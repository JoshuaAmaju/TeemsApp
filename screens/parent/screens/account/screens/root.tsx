import {useNavigation} from '@react-navigation/native';
import {HStack, Menu, VStack} from 'native-base';
import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {ChevronRight, Exit} from '@exports/icons';

import * as UserStore from '@stores/user';
import {useQueryClient} from 'react-query';

const screens = [
  {
    name: 'EditProfile',
    label: 'Edit Profile',
  },
  // {
  //   name: 'Security',
  //   label: 'Security',
  // },
  {
    name: 'About',
    label: 'About us',
  },
];

export default function Main() {
  const nav = useNavigation();

  const queryClient = useQueryClient();

  const [{context}, send] = UserStore.useContext();

  const {code} = context.data ?? {};

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding: 24}}>
      <VStack space={12}>
        <VStack space={8}>
          <VStack space={6}>
            {screens.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => nav.navigate(s.name as any)}>
                <HStack space={1} style={styles.card}>
                  <Text style={styles.title}>{s.label}</Text>
                  <ChevronRight width={15} height={15} color="#31031CA6" />
                </HStack>
              </TouchableOpacity>
            ))}

            <Menu
              w="190"
              trigger={triggerProps => {
                return (
                  <TouchableOpacity {...triggerProps}>
                    <HStack space={1} style={styles.card}>
                      <Text style={styles.title}>Security</Text>
                      <ChevronRight
                        width={15}
                        height={15}
                        color="#31031CA6"
                        style={{
                          transform: [
                            {
                              rotate: triggerProps['aria-expanded']
                                ? '90deg'
                                : '0deg',
                            },
                          ],
                        }}
                      />
                    </HStack>
                  </TouchableOpacity>
                );
              }}>
              <Menu.Item
                onPress={() => {
                  // @ts-ignore
                  nav.navigate('Change', {type: 'password'});
                }}>
                Change Password
              </Menu.Item>

              <Menu.Item
                onPress={() => {
                  // @ts-ignore
                  nav.navigate('Change', {type: 'pin'});
                }}>
                Change Pin
              </Menu.Item>
            </Menu>
          </VStack>

          <TouchableOpacity onPress={() => {}}>
            <HStack
              space={1}
              style={[
                styles.card,
                {borderWidth: 0, backgroundColor: '#B6739F'},
              ]}>
              <Text style={[styles.title, styles.ref]}>Reference Code</Text>
              <Text style={[styles.title, styles.ref]}>{code}</Text>
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => nav.navigate('Faq' as any)}>
            <HStack space={1} style={styles.card}>
              <Text style={styles.title}>FAQs</Text>
              <ChevronRight width={15} height={15} color="#31031CA6" />
            </HStack>
          </TouchableOpacity>
        </VStack>

        <TouchableOpacity
          onPress={() => {
            queryClient.clear();
            queryClient.cancelMutations();
            send(UserStore.Action.logout);
          }}>
          <HStack space={2} alignItems="center">
            <Text style={{color: '#FF0000', fontSize: 18, fontWeight: '700'}}>
              Sign Out
            </Text>

            <Exit width={15} height={15} color="#FD6585" />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: 'center',
    paddingHorizontal: 20,
    borderColor: '#E1E1E1',
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
  },
  ref: {
    color: '#fff',
    fontWeight: '900',
  },
});
