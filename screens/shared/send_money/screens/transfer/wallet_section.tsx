import {FormControl, VStack} from 'native-base';
import React, {useCallback, useRef} from 'react';
import {Text, Title} from 'react-native-paper';
import {useMachine} from '@xstate/react';

import TextInput from '@components/input/text';
import Failure from '@global/components/failure';
import TextArea from '@global/components/input/textarea';
import Success from '@global/components/success';
import Button from '@global/components/button';
import PinEntry from '@global/components/pin_step';

import ConfirmationModal from './components/confirmation_modal';
import ActivityIndicator from '@global/components/activity_indicator';

import * as z from 'zod';

import {base_schema} from './utils';
import * as currency from '@utils/currency';

import {config} from './machine';
import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';
import {StyleSheet, View} from 'react-native';

export const schema = z
  .object({
    email: z.string(),
  })
  .merge(base_schema);

type Form = z.infer<typeof schema>;

type Errors = z.ZodFormattedError<Form>;

export default function WalletToWallet() {
  const [current, send] = useMachine(config);

  const form = useRef(
    factory<Form, Errors, any, Error>({
      initialErrors: {},
      initialValues: {},

      onValidate(values) {
        const data = schema.safeParse(values);
        if (!data.success) throw data.error.format();
      },

      async onSubmit() {},
    }),
  );

  const [
    {
      // data,
      // error,
      submit,
      values,
      errors,
      isError,
      setValue,
      submitted,
      isSubmitting,
    },
  ] = useForm(form.current);

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
          <FormControl isRequired isInvalid={!!errors?.email}>
            <TextInput
              mode="outlined"
              value={values.email}
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Recipient’s  E-mail"
              onChangeText={setFieldValue('email')}
            />

            <FormControl.ErrorMessage>
              {errors?.email?._errors.join(', ')}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors?.amount}>
            <TextInput
              mode="outlined"
              placeholder="Amount"
              keyboardType="number-pad"
              onChangeText={setFieldValue('amount')}
            />

            <FormControl.ErrorMessage>
              {errors?.amount?._errors.join(', ')}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors?.narration}>
            <TextArea
              mode="outlined"
              placeholder="Narration"
              onChangeText={setFieldValue('narration')}
            />

            <FormControl.ErrorMessage>
              {errors?.narration?._errors.join(', ')}
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
          onSubmitEditing={() => send('next')}
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
