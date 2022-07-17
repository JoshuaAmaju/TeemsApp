import {FormControl, HStack, Select, VStack} from 'native-base';
import React, {useCallback, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Caption, Subheading, Switch, Title} from 'react-native-paper';

import * as currency from '@utils/currency';

import Button from '@components/button';
import TextInput from '@components/input/text';
import Screen from '@components/screen';
import {http} from '@global/utils/http';
import {Color} from '@global/utils/style';
import {useRoute} from '@react-navigation/native';

import * as z from 'zod';

import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';

import ActivityIndicator from '@global/components/activity_indicator';
import Success from '@global/components/success';
import Failure from '@global/components/failure';

enum Allowance {
  daily = 'Daily',
  weekly = 'Weekly',
  monthly = 'Monthly',
  fortnightly = 'Fortnightly',
}

const schema = z.object({
  amount: z.string(),
  time_interval: z.string({required_error: 'Please select a time interval'}),
});

type Form = z.infer<typeof schema> & {kid: string; start_now: boolean};

type Errors = z.ZodFormattedError<Form>;

type Error = {error: string};

export default function CreateAllowance() {
  const {kid} = useRoute().params as {kid: string};

  const form = useRef(
    factory<Form, Errors, any, Error>({
      initialErrors: {},
      initialValues: {
        kid,
        start_now: false,
      },

      onValidate({amount, ...vals}) {
        const data = schema.safeParse({
          ...vals,
          amount: parseFloat(amount),
        });

        if (!data.success) throw data.error.format();
      },

      async onSubmit(vals) {
        const res = await http.post('/parentapi/v1/allowance/', vals);

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
      <Screen contentContainerStyle={{padding: 24, minHeight: '100%'}}>
        <VStack space={8} flex={1} justifyContent="space-between">
          <VStack space={6}>
            <FormControl isInvalid={!!errors?.time_interval}>
              <Select
                p={15}
                bg="#FAFAFA"
                borderRadius={10}
                placeholder="Allowance"
                onValueChange={setFieldValue('time_interval')}>
                {[Allowance.daily, Allowance.weekly, Allowance.monthly].map(
                  interval => (
                    <Select.Item
                      key={interval}
                      value={interval}
                      label={interval}
                    />
                  ),
                )}
              </Select>

              <FormControl.ErrorMessage>
                {errors?.time_interval?._errors.join(', ')}
              </FormControl.ErrorMessage>
            </FormControl>

            <HStack
              alignItems="center"
              style={styles.card}
              justifyContent="space-between">
              <Subheading>Starts now</Subheading>
              <Switch
                color="#14C689"
                theme={{mode: 'exact'}}
                value={values.start_now}
                onValueChange={setFieldValue('start_now')}
              />
            </HStack>

            <VStack space={2}>
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

              {values.amount && (
                <Caption style={styles.warning}>
                  You will charged 2% of the amount for every-time the allowance
                  is sent to your child's wallet
                </Caption>
              )}
            </VStack>
          </VStack>

          <Button onPress={() => submit()} style={{alignSelf: 'center'}}>
            Continue
          </Button>
        </VStack>
      </Screen>

      {isSubmitting && <ActivityIndicator />}

      {submitted && (
        <Success>
          <Title>Automated Allowance set</Title>
        </Success>
      )}

      {isError && (
        <Failure>
          <Title>Automated Allowance set</Title>
        </Failure>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E1E1E1',
    backgroundColor: '#FAFAFA',
  },
  warning: {
    lineHeight: 15,
    color: Color.bitterSweet,
  },
});
