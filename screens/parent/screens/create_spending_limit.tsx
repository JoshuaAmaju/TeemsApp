import {FormControl, VStack} from 'native-base';
import React, {useCallback, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Caption, Title} from 'react-native-paper';

import TextInput from '@components/input/text';
import Button from '@global/components/button';
import Screen from '@global/components/screen';

import * as z from 'zod';

import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';
import {http} from '@global/utils/http';
import {useRoute} from '@react-navigation/native';

import * as currency from '@utils/currency';
import Success from '@global/components/success';
import Failure from '@global/components/failure';

const schema = z.object({
  amount: z.string(),
});

type Form = z.infer<typeof schema> & {kid_code: string};

type Errors = z.ZodFormattedError<Form>;

type Error = {error: string};

export default function CreateSpendingLimit() {
  const {kid} = useRoute().params as {kid: string};

  const form = useRef(
    factory<Form, Errors, any, Error>({
      initialErrors: {},
      initialValues: {
        kid_code: kid,
      },

      onValidate({amount, ...vals}) {
        const data = schema.safeParse({
          ...vals,
          amount: parseFloat(amount),
        });

        if (!data.success) throw data.error.format();
      },

      async onSubmit(vals) {
        const res = await http.post(
          '/parentapi/v1/users/set-spending-limit/',
          vals,
        );

        console.log(res);
      },
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
      <Screen contentContainerStyle={styles.screen}>
        <VStack space={8} flex={1} justifyContent="space-between">
          <VStack space={6}>
            <Caption>
              By creating a spending limit, you can monitor how and what your
              kid spends on
            </Caption>

            <FormControl isInvalid={!!errors?.amount}>
              <VStack space={1}>
                <TextInput
                  label="Amount"
                  mode="outlined"
                  value={values.amount}
                  keyboardType="numeric"
                  error={!!errors?.amount}
                  onSubmitEditing={() => submit()}
                  onChangeText={setFieldValue('amount')}
                />

                <Caption>
                  {currency.format(parseFloat(values.amount ?? '0'))}
                </Caption>
              </VStack>

              <FormControl.ErrorMessage>
                {errors?.amount?._errors.join(', ')}
              </FormControl.ErrorMessage>
            </FormControl>
          </VStack>

          <Button
            loading={isSubmitting}
            onPress={() => submit()}
            style={{alignSelf: 'center'}}>
            Save
          </Button>
        </VStack>
      </Screen>

      {submitted && (
        <Success>
          <Title>Spending Limit Applied</Title>
        </Success>
      )}

      {isError && (
        <Failure>
          <VStack space={2}>
            <Title>Spending Limit Applied</Title>

            <Button
              mode="outlined"
              onPress={() => {
                setFieldValue('amount')(values.amount);
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
  screen: {
    padding: 24,
    minHeight: '100%',
  },
  card: {
    paddingVertical: 3,
    backgroundColor: '#FAFAFA',
  },
});
