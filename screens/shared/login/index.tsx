/* ------------------------------- components ------------------------------- */
import Button from '@components/button';
import PasswordInput from '@components/input/password';
import TextInput from '@components/input/text';

import {useNavigation} from '@react-navigation/native';
import * as UserStore from '@stores/user';
import axios, {AxiosError} from 'axios';
import {FormControl, VStack} from 'native-base';
import React, {createRef, useCallback, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import {showMessage} from 'react-native-flash-message';
import {Caption, Headline, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as z from 'zod';

import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';

import {url} from '@env';
import {Info} from '@stores/user/types';

import * as Onboarding from '@stores/onboarding';

type Response = {
  token: string;
  message: string;
  user_data: Info;
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<Response> => {
  const {data} = await axios.post(
    url + '/parentapi/v1/users/login/',
    credentials,
  );

  return data;
};

const passwordLength = 4;

const schema = z.object({
  email: z
    .string({required_error: 'Email address is required'})
    .email('Please enter a valid email'),
  password: z
    .string({required_error: 'Password is required'})
    .min(
      passwordLength,
      `Password must be at least ${passwordLength} characters`,
    ),
});

type Form = z.infer<typeof schema>;

type FormErrors = z.ZodFormattedError<Form>;

type FormData = Awaited<ReturnType<typeof login>>;

const form = factory<Form, FormErrors, FormData, Error>({
  initialValues: {},
  initialErrors: {},

  onValidate(values) {
    const data = schema.safeParse(values);
    if (!data.success) throw data.error.format();
  },

  async onSubmit(values) {
    // return new Promise(r => {
    //   setTimeout(r, 3000, {});
    // });

    return login(values).catch(error => {
      const err =
        (error as AxiosError<Record<string, string[]>>).response?.data ??
        (error as Error);

      // console.log(error, err, (error as any).response?.data);

      if (err instanceof Error && err.name === 'NetworkError') {
        return Promise.reject(new Error(err.message));
      } else {
        // create multiline error message from server error array response
        return Promise.reject(
          new Error(
            Object.values(err as Record<string, string[]>)
              .map(e => e.join(', '))
              .join('\n'),
          ),
        );
      }
    });
  },
});

export default function Login() {
  const nav = useNavigation();

  const {accent} = useTheme().colors;

  // const userType = UserType.store(UserType.typeSelector)
  // const onboarded = Onboarding.store(Onboarding.selector)

  const [, sendUser] = UserStore.useContext();

  const [, sendOnboarding] = Onboarding.useContext();

  // const [current, send, service] = useMachine(form)

  const [
    {
      data,
      error,
      submit,
      values,
      errors,
      isError,
      setValue,
      submitted,
      isSubmitting,
    },
  ] = useForm(form);

  const passwordRef = createRef<RNTextInput>();

  const setFieldValue = useCallback<
    <N extends keyof Form>(name: N) => (value: Form[N]) => void
  >(
    name => value => {
      setValue({...values, [name]: value});
    },
    [setValue, values],
  );

  const onNext = useCallback(
    function focusPasswordInput() {
      passwordRef.current?.focus();
    },
    [passwordRef],
  );

  useEffect(() => {
    if (submitted && data) {
      showMessage({
        type: 'success',
        message: 'Login successful',
        onHide() {
          // User.login(data.token, data.user_data)
          const {token, user_data} = data;

          sendUser({
            type: UserStore.Action.login,
            data: {token, data: user_data},
          });

          sendOnboarding(Onboarding.Action.complete);
        },
      });
    }
  }, [nav, data, submitted, sendUser, sendOnboarding]);

  useEffect(() => {
    if (isError && error) {
      showMessage({type: 'danger', message: error.message});
    }
  }, [error, isError]);

  // console.log(errors, data, error);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <ScrollView>
        <View style={styles.hero}>
          <SafeAreaView>
            <Image source={require('./header.png')} />
          </SafeAreaView>
        </View>

        <VStack p={6} space={6} flex={1} justifyContent="space-between">
          <VStack space={6}>
            <View>
              <Headline>Log In</Headline>
              <Caption style={{color: accent}}>
                Please Log in to continue
              </Caption>
            </View>

            <VStack space={4}>
              <FormControl isRequired isInvalid={!!errors?.email}>
                <TextInput
                  mode="outlined"
                  placeholder="Email"
                  value={values.email}
                  returnKeyType="next"
                  onSubmitEditing={onNext}
                  keyboardType="email-address"
                  onChangeText={setFieldValue('email')}
                />

                <FormControl.ErrorMessage>
                  * {errors?.email?._errors.join(', ')}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors?.password}>
                <PasswordInput
                  mode="outlined"
                  ref={passwordRef}
                  returnKeyType="go"
                  placeholder="Password"
                  value={values.password}
                  onSubmitEditing={() => submit()}
                  onChangeText={setFieldValue('password')}
                />

                <FormControl.ErrorMessage>
                  * {errors?.password?._errors.join(', ')}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
          </VStack>

          <Button
            mode="contained"
            style={styles.btn}
            loading={isSubmitting}
            onPress={() => submit()}
            labelStyle={{color: 'white'}}>
            Log in
          </Button>
        </VStack>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    minWidth: '60%',
    alignSelf: 'center',
  },
});
