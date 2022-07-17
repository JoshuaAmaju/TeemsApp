// import {useNavigation} from '@react-navigation/native';
import {VStack} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Copy from './assets/copy.svg';

export default function Root() {
  // const nav = useNavigation();

  return (
    <VStack flex={1} p={6} space={6} bg="#fff" justifyContent="space-between">
      <VStack space={8}>
        <Text>
          Transfer money to your permanent TeemsApp virtual account number for
          your TeemsApp wallet to be funded.
        </Text>

        <VStack space={6}>
          <View style={styles.card}>
            <Text style={styles.text}>VBank</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.text}>8123498290</Text>
            <Copy width={20} height={20} color="#000" />
          </View>

          <View style={styles.card}>
            <Text style={styles.text}>Mobolaji Deji</Text>
          </View>
        </VStack>
      </VStack>

      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => {}}
        labelStyle={{color: 'white'}}>
        Proceed
      </Button>
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
  text: {
    fontSize: 18,
    fontWeight: '400',
  },
});
