import {useNavigation} from '@react-navigation/native';
import {get_kids} from '@screens/services/kid';
import {VStack} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, Title} from 'react-native-paper';
import {useQuery} from 'react-query';

export default function TransferRecipient() {
  const nav = useNavigation();

  const query = useQuery(['kids'], get_kids);

  console.log(query.data);

  return (
    <VStack flex={1} p={6} space={6} bg="#fff" justifyContent="space-between">
      <VStack space={2}>
        <Title>Who would you like to send money to?</Title>

        <VStack space={4}>
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              nav.navigate('ParentToKid', {recipient: 1});
            }}>
            <View style={styles.card}>
              <Text>John Doe</Text>
            </View>
          </TouchableOpacity>
        </VStack>
      </VStack>

      {/* <Button
        mode="contained"
        style={styles.btn}
        labelStyle={{ color: 'white' }}
        onPress={() => {
          // @ts-ignore
          nav.navigate('Transfer', { type: 'parent_to_kid' })
        }}>
        Proceed
      </Button> */}
    </VStack>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E1E1E1',
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
  },
  btn: {
    minWidth: '70%',
    marginBottom: 20,
    alignSelf: 'center',
  },
});
