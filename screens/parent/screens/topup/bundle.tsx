import TextInput from '@components/input/text';
import {useRoute} from '@react-navigation/native';
import {Box, FormControl, Select, VStack} from 'native-base';
import React, {createRef, useCallback, useRef, useState} from 'react';
import {Platform, StyleSheet, TextInput as RNTextInput} from 'react-native';
import {
  ActivityIndicator as RNPActivityIndicator,
  Button,
  Caption,
  Text,
  useTheme,
} from 'react-native-paper';

import {http} from '@utils/http';
import * as T from 'fp-ts/Task';
import {Type} from './types';

import ActivityIndicator from '@global/components/activity_indicator';
import Failure from '@global/components/failure';
import PinEntry from '@global/components/pin_step';
import Success from '@global/components/success';
import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';
import {useQuery} from 'react-query';
import * as z from 'zod';

import * as currency from '@utils/currency';

const schema = z.object({
  // password: z.string(),
  plan: z.string({required_error: 'Please select a plan'}),
  phone_number: z.string({required_error: 'Please enter a phone number'}),
  amount: z.number({
    required_error: 'Please enter an amount',
    invalid_type_error: 'Please enter an amount',
  }),
});

type Form = z.infer<typeof schema> & {password: string};

type FormErrors = z.ZodFormattedError<Form> & {
  password: z.ZodFormattedError<string>;
};

type Bundle = {
  plan: string;
  amount: number;
  description: string;
};

const get_bundles = (): T.Task<Bundle[]> => {
  return async () => {
    const {data} = await http.get('/parentapi/v1/bills/internet-data-bundle/');
    return data.entity;
  };
};

export default function Bundle() {
  //   const nav = useNavigation();
  const {type} = useRoute().params as {type: Type};

  const {primary} = useTheme().colors;

  const [showPin, setShowPin] = useState(false);

  const phoneNumberRef = createRef<RNTextInput>();

  const query = useQuery(['bundles'], get_bundles(), {
    enabled: type === Type.dataBundle,
  });

  const [
    {
      data,
      error,
      errors,
      values,
      submit,
      setValue,
      isError,
      submitted,
      isSubmitting,
    },
    send,
    service,
  ] = useForm(
    useRef(
      factory<Form, FormErrors, any, {error: string}>({
        initialValues: {},
        initialErrors: {},

        onValidate({amount, ...vals}) {
          const shape = schema.omit(type === Type.airtime ? {plan: true} : {});

          const d = shape.safeParse({
            ...vals,
            amount: parseFloat(amount as unknown as string),
          });

          if (!d.success) throw d.error.format();
        },

        async onSubmit(vals) {
          return http.post(
            type === Type.airtime
              ? '/parentapi/v1/bills/airtime/'
              : '/parentapi/v1/bills/internet-data-bundle/',
            vals,
          );
        },
      }),
    ).current,
  );

  const setFieldValue = useCallback<
    <N extends keyof Form>(name: N) => (value: Form[N] | any) => void
  >(
    name => value => {
      setValue({...values, [name]: value});
    },
    [setValue, values],
  );

  const onPinSubmit = useCallback(() => {
    const res = z.string().safeParse(values.password);

    if (!res.success) {
      send({
        type: 'set',
        name: 'errors',
        value: {password: res.error.format()},
      });
    } else {
      setShowPin(false);
      submit();
    }
  }, [submit, send, values.password]);

  const onSubmit = useCallback(() => {
    const subscription = service.subscribe(state => {
      if (
        state.matches('idle') &&
        state.history?.matches('validating') &&
        !state.context.errors
      ) {
        setShowPin(true);
        subscription?.unsubscribe();
      }
    });

    send('validate');
  }, [send, service]);

  console.log(data, error);

  return (
    <>
      <VStack flex={1} p={6} space={6} bg="#fff" justifyContent="space-between">
        <VStack space={6}>
          {type === Type.dataBundle && (
            <FormControl isInvalid={!!errors?.plan}>
              <Select
                py={17}
                bg="#FAFAFA"
                borderRadius={10}
                placeholder="Data Plans"
                _important={{fontSize: 16}}
                onValueChange={setFieldValue('plan')}
                dropdownIcon={
                  query.isLoading ? (
                    <Box px={4}>
                      <RNPActivityIndicator size={20} color={primary} />
                    </Box>
                  ) : undefined
                }>
                {query.data?.map(bundle => (
                  <Select.Item
                    key={bundle.plan}
                    value={bundle.plan}
                    label={bundle.description}
                  />
                ))}
              </Select>

              <FormControl.ErrorMessage>
                * {errors?.plan?._errors.join(', ')}
              </FormControl.ErrorMessage>
            </FormControl>
          )}

          {type === Type.airtime && (
            <FormControl isInvalid={!!errors?.amount}>
              <VStack space={1}>
                <TextInput
                  label="Amount"
                  mode="outlined"
                  autoComplete="off"
                  returnKeyType="next"
                  placeholder="Amount"
                  keyboardType="numeric"
                  error={!!errors?.amount}
                  placeholderTextColor="#000"
                  onChangeText={setFieldValue('amount')}
                  onSubmitEditing={() => phoneNumberRef.current?.focus()}
                />

                <Caption>{currency.format(values.amount ?? 0)}</Caption>
              </VStack>

              <FormControl.ErrorMessage>
                * {errors?.amount?._errors.join(', ')}
              </FormControl.ErrorMessage>
            </FormControl>
          )}

          <FormControl isInvalid={!!errors?.phone_number}>
            <TextInput
              mode="outlined"
              ref={phoneNumberRef}
              autoComplete="tel"
              label="Phone Number"
              returnKeyType="done"
              keyboardType="numeric"
              placeholder="Phone Number"
              onSubmitEditing={onSubmit}
              placeholderTextColor="#000"
              error={!!errors?.phone_number}
              onChangeText={setFieldValue('phone_number')}
            />

            <FormControl.ErrorMessage>
              * {errors?.phone_number?._errors.join(', ')}
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>

        <Button
          mode="contained"
          onPress={onSubmit}
          style={styles.btn}
          labelStyle={{color: 'white'}}>
          Proceed
        </Button>
      </VStack>

      {showPin && (
        <PinEntry
          onSubmit={onPinSubmit}
          onSubmitEditing={onPinSubmit}
          onChangeText={setFieldValue('password')}
          error={errors?.password?._errors.join(', ')}
        />
      )}

      {isSubmitting && <ActivityIndicator />}

      {submitted && (
        // <VStack
        //   space={8}
        //   style={[styles.overlay, styles.elevate, {backgroundColor: 'white'}]}>
        //   <Image source={require('../../../../assets/check.pill.png')} />
        //   <Text>You have succesfully activated your Data Plan.</Text>
        // </VStack>

        <Success>
          <Text>You have succesfully activated your Data Plan.</Text>
        </Success>
      )}

      {isError && error && (
        <Failure>
          <VStack space={4}>
            <Text>{error.error}</Text>

            <Button
              mode="outlined"
              onPress={() => {
                setFieldValue('phone_number')(values.phone_number);
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
  card: {
    // paddingVertical: 3,
    // backgroundColor: '#FAFAFA',
  },
  btn: {
    minWidth: '70%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  elevate: {
    ...Platform.select({
      ios: {zIndex: 100},
      android: {elevation: 100},
    }),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
