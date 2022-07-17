import TextInput from '@components/input/text';
// import {useNavigation, useRoute} from '@react-navigation/native';
import {FormControl, VStack} from 'native-base';
import React, {useCallback, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, Title} from 'react-native-paper';

import * as currency from '@utils/currency';

import {useMachine} from '@xstate/react';
import {config} from './machine';

import * as z from 'zod';

import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';

import {base_schema} from './utils';

import ActivityIndicator from '@global/components/activity_indicator';
import Failure from '@global/components/failure';
import TextArea from '@global/components/input/textarea';
import Success from '@global/components/success';
import ConfirmationModal from './components/confirmation_modal';
import PinEntry from '@global/components/pin_step';

type Form = z.infer<typeof base_schema>;

type FormErrors = z.ZodFormattedError<Form>;

// type FormData = Awaited<ReturnType<typeof login>>;

export default function ParentToKid() {
  //   const nav = useNavigation();
  //   const {params = {} as any} = useRoute();

  //   const {recipient} = params;

  const [current, send] = useMachine(config);

  const form = useRef(
    factory<Form, FormErrors, any, Error>({
      initialErrors: {},
      initialValues: {},

      onValidate(values) {
        const data = base_schema.safeParse(values);
        if (!data.success) throw data.error.format();
      },

      async onSubmit() {},
    }),
  );

  const [
    {
      //   data,
      //   error,
      submit,
      values,
      errors,
      isError,
      setValue,
      submitted,
      isSubmitting,
    },
  ] = useForm(form.current);

  // console.log(data);

  // console.log(errors);

  console.log(values);

  const setFieldValue = useCallback<
    <N extends keyof Form>(name: N) => (value: Form[N]) => void
  >(
    name => value => {
      setValue({...values, [name]: value});
    },
    [setValue, values],
  );

  return (
    <>
      <VStack flex={1} p={6} space={6} bg="#fff" justifyContent="space-between">
        <VStack space={4}>
          <FormControl isRequired isInvalid={!!errors?.amount}>
            <TextInput
              mode="outlined"
              placeholder="Amount"
              keyboardType="number-pad"
              onChangeText={setFieldValue('amount')}
            />

            <FormControl.ErrorMessage>
              * {errors?.amount?._errors.join(', ')}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors?.narration}>
            <TextArea
              mode="outlined"
              placeholder="Narration"
              onChangeText={setFieldValue('narration')}
            />

            <FormControl.ErrorMessage>
              * {errors?.narration?._errors.join(', ')}
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>

        <Button
          mode="contained"
          style={styles.btn}
          onPress={() => send('start')}
          labelStyle={{color: 'white'}}>
          Continue
        </Button>
      </VStack>

      {current.matches('enterPin') && (
        <PinEntry
          onSubmit={() => send('next')}
          onSubmitEditing={() => {
            // send next twice to skip the `confirmInfo` state
            send(['next', 'next']);
          }}
          onChangeText={setFieldValue('password')}
        />
      )}

      {current.matches('confirmTransfer') && (
        <ConfirmationModal
          onCancel={() => send('cancel')}
          onConfirm={() => {
            send('done');
            submit();
          }}
        />
      )}

      {isSubmitting && <ActivityIndicator />}

      {submitted && (
        <Success>
          <Text style={styles.label}>
            You have successfully sent{' '}
            {currency.format(parseFloat(values.amount))}
          </Text>
        </Success>
      )}

      {isError && (
        <Failure>
          <VStack space={4}>
            <View>
              <Title>Transaction Declined</Title>
              <Text style={styles.label}>Due to insufficient funds</Text>
            </View>

            <Button
              mode="outlined"
              onPress={() => {
                // a hack to dismiss the modal, exiting the error state given
                // setting any form value resets the form to its idle state
                setFieldValue('narration')(values.narration);
              }}>
              Dismiss
            </Button>
          </VStack>
        </Failure>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    minWidth: '70%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    maxWidth: 200,
    lineHeight: 25,
    textAlign: 'center',
  },
});
