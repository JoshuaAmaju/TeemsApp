import Button from '@components/button';
import PasswordInput from '@components/input/password';
import {useRoute} from '@react-navigation/native';
import {FormControl, VStack} from 'native-base';
import React, {createRef, useCallback, useEffect, useRef} from 'react';
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

// form
import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';
import {showMessage} from 'react-native-flash-message';
import * as z from 'zod';

import {http} from '@utils/http';
import * as UserStore from '@stores/user';

const schema = z
  .object({
    new_password: z.string(),
    current_password: z.string(),
    confirm_new_password: z.string(),
  })
  .refine(vals => vals.new_password === vals.confirm_new_password, {
    path: ['confirm_new_password'],
    message: "Passwords don't match",
  });

type Form = z.infer<typeof schema>;

type FormErrors = z.ZodFormattedError<Form>;

type FormError = Error | Record<keyof Form, string[]>;

export default function Change() {
  const {type} = useRoute().params as {type: 'pin' | 'password'};

  const keyboardType: KeyboardTypeOptions =
    type === 'pin' ? 'number-pad' : 'default';

  const refNew = createRef<TextInput>();
  const refConfirmNew = createRef<TextInput>();

  const [, send] = UserStore.useContext();

  const [
    {
      data,
      error,
      errors,
      values,
      submit,
      isError,
      setValue,
      submitted,
      isSubmitting,
    },
  ] = useForm(
    useRef(
      factory<Form, FormErrors, unknown, FormError>({
        initialErrors: {},
        initialValues: {},

        onValidate(vals) {
          const d = schema.safeParse(vals);
          if (!d.success) throw d.error.format();
        },

        onSubmit({confirm_new_password: _, ...vals}) {
          return type === 'pin'
            ? http
                .put('/parentapi/v1/wallets/change-wallet-password/', vals)
                .catch(e =>
                  Promise.reject(e.message ? new Error(e.message) : e),
                )
            : http.post('/parentapi/v1/auth/users/set_password/', vals);
        },
      }),
    ).current,
  );

  const setFieldValue = useCallback<
    <N extends keyof Form>(name: N) => (value: Form[N]) => void
  >(
    name => value => {
      setValue({...values, [name]: value});
    },
    [setValue, values],
  );

  useEffect(() => {
    if (submitted && type === 'password') {
      send(UserStore.Action.logout);
    }
  }, [send, type, submitted]);

  useEffect(() => {
    if (submitted) {
      showMessage({
        type: 'success',
        message: (data as any).response ?? 'Password updated',
      });
    }
  }, [data, submitted]);

  useEffect(() => {
    if (isError && error instanceof Error) {
      showMessage({type: 'danger', message: error.message});
    }
  }, [error, isError]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: '#fff'}}
      contentContainerStyle={{padding: 24, minHeight: '100%'}}>
      <VStack space={2} flex={1} justifyContent="space-between">
        <VStack space={5}>
          <FormControl
            isRequired
            isInvalid={
              !!(errors?.current_password ?? (error as any)?.current_password)
            }>
            <PasswordInput
              mode="outlined"
              style={styles.input}
              returnKeyType="next"
              label={`Old ${type}`}
              keyboardType={keyboardType}
              value={values.current_password}
              onSubmitEditing={() => refNew.current?.focus()}
              onChangeText={setFieldValue('current_password')}
            />

            <FormControl.ErrorMessage>
              *{' '}
              {error
                ? (error as any)?.current_password?.join('\n')
                : errors?.current_password?._errors.join('\n')}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              !!(errors?.new_password ?? (error as any)?.new_password)
            }>
            <PasswordInput
              ref={refNew}
              mode="outlined"
              style={styles.input}
              returnKeyType="next"
              label={`New ${type}`}
              keyboardType={keyboardType}
              value={values.new_password}
              onChangeText={setFieldValue('new_password')}
              onSubmitEditing={() => refConfirmNew.current?.focus()}
            />

            <FormControl.ErrorMessage>
              *{' '}
              {error
                ? (error as any)?.new_password?.join('\n')
                : errors?.new_password?._errors.join('\n')}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors?.confirm_new_password}>
            <PasswordInput
              mode="outlined"
              ref={refConfirmNew}
              returnKeyType="done"
              style={styles.input}
              label={`Confirm ${type}`}
              keyboardType={keyboardType}
              onSubmitEditing={() => submit()}
              value={values.confirm_new_password}
              onChangeText={setFieldValue('confirm_new_password')}
            />

            <FormControl.ErrorMessage>
              * {errors?.confirm_new_password?._errors.join(', ')}
            </FormControl.ErrorMessage>
          </FormControl>
        </VStack>

        <Button
          mode="contained"
          loading={isSubmitting}
          onPress={() => submit()}
          labelStyle={{color: 'white'}}
          style={{alignSelf: 'center', minWidth: '70%'}}>
          Save Changes
        </Button>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#E1E1E1',
    backgroundColor: '#FAFAFA',
  },
});
