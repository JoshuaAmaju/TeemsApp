import {FormControl, Select, VStack} from 'native-base';
import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Subheading, Text, Title} from 'react-native-paper';

import * as T from 'fp-ts/Task';
import {useQuery} from 'react-query';

import * as currency from '@utils/currency';
import {http} from '@utils/http';

import TextInput from '@components/input/text';
import Failure from '@global/components/failure';
import TextArea from '@global/components/input/textarea';
import Success from '@global/components/success';

import ActivityIndicator from '@global/components/activity_indicator';
import ConfirmationModal from './components/confirmation_modal';

import * as z from 'zod';
import {base_schema} from './utils';

import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';

import Button from '@global/components/button';
import {useMachine} from '@xstate/react';
import PinEntry from '@global/components/pin_step';
import {config} from './machine';

type Bank = {
  name: string;
  code: string;
};

const schema = z
  .object({
    recipient_bank_code: z.string(),
    recipient_account_number: z.string(),
  })
  .merge(base_schema);

type Form = z.infer<typeof schema>;

type Errors = z.ZodFormattedError<Form>;

type Error = {error: string};

const get_banks = (): T.Task<Bank[]> => {
  return () => http.get('/parentapi/v1/wallets/banks/');
};

type AccountDetails = Record<'account_name' | 'account_number', string>;

const get_account = (
  account_number: string,
  bank_code: string,
): T.Task<AccountDetails> => {
  return async () => {
    const body = {bank_code, account_number};

    const {data} = await http.post(
      '/parentapi/v1/wallets/resolve-nuban/',
      body,
    );

    return data.entity;
  };
};

export default function InterbankTransfer() {
  const [current, send] = useMachine(config);

  const form = useRef(
    factory<Form, Errors, any, Error>({
      initialErrors: {},
      initialValues: {},

      onValidate(values) {
        const data = schema.safeParse(values);
        if (!data.success) throw data.error.format();
      },

      async onSubmit(vals) {
        const res = await http.post(
          '/parentapi/v1/wallets/inter-bank-transfer/',
          vals,
        );

        console.log(res);
      },
    }),
  );

  const [
    {
      // data,
      error,
      submit,
      values,
      errors,
      isError,
      setValue,
      submitted,
      isSubmitting,
    },
  ] = useForm(form.current);

  console.log(error);

  const bankCode = values.recipient_bank_code;
  const accountNumber = values.recipient_account_number;

  const banks = useQuery(['banks'], get_banks());

  const account_details = useQuery<AccountDetails, {message: string}>(
    ['account_details', bankCode, accountNumber],
    get_account(accountNumber!, bankCode!),
    {
      refetchInterval: false,
      enabled: bankCode !== undefined && accountNumber !== undefined,
    },
  );

  const bank = useMemo(() => {
    return banks.data?.find(b => b.code === values.recipient_bank_code);
  }, [banks.data, values.recipient_bank_code]);

  // console.log(values);

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
          <FormControl
            isInvalid={
              !!errors?.recipient_account_number || account_details.isError
            }>
            <TextInput
              mode="outlined"
              value={accountNumber}
              keyboardType="number-pad"
              placeholder="Recipient Account Number"
              onChangeText={setFieldValue('recipient_account_number')}
            />

            <FormControl.ErrorMessage>
              {errors?.recipient_account_number?._errors.join(', ') ||
                account_details.error?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors?.recipient_bank_code}>
            <Select
              py={4}
              bg="#FAFAFA"
              borderRadius={10}
              selectedValue={bankCode}
              _important={{fontSize: 16}}
              placeholder="Recipient’s Bank"
              onValueChange={setFieldValue('recipient_bank_code')}>
              {banks.data?.map(({name, code}) => (
                <Select.Item key={code} label={name} value={code} />
              ))}
            </Select>

            <FormControl.ErrorMessage>
              * {errors?.recipient_bank_code?._errors.join(', ')}
            </FormControl.ErrorMessage>
          </FormControl>

          <TextInput
            mode="outlined"
            disabled={true}
            value={account_details.data?.account_name}
            placeholder={
              account_details.isLoading
                ? 'Getting account details...'
                : 'Account Name'
            }
          />

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

      {current.matches('confirmInfo') && (
        <View style={[styles.overlay, styles.summary]}>
          <VStack space={6}>
            <VStack space={4}>
              {account_details.data && (
                <Subheading>
                  Name of account: {account_details.data.account_name}
                </Subheading>
              )}

              {bank && <Subheading>Bank: {bank.name}</Subheading>}

              <Subheading>
                Account Number: {values.recipient_account_number}
              </Subheading>

              {values.amount && (
                <Subheading>
                  Amount: {currency.format(parseFloat(values.amount))}
                </Subheading>
              )}

              <Subheading>Narration: {values.narration}</Subheading>
            </VStack>

            <VStack space={4}>
              <Button mode="outlined" onPress={() => send('next')}>
                Continue
              </Button>

              <Button onPress={() => send('cancel')}>Cancel</Button>
            </VStack>
          </VStack>
        </View>
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
            {currency.format(parseFloat(values.amount))} to{' '}
            <Text style={{fontWeight: '700'}}>
              {account_details.data?.account_name}
            </Text>
          </Text>
        </Success>
      )}

      {isError && (
        <Failure>
          <VStack space={4}>
            <View>
              <Title>Transaction Declined</Title>
              <Text style={styles.label}>{error?.error}</Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    maxWidth: 200,
    lineHeight: 25,
    textAlign: 'center',
  },
  pin: {
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  summary: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});
