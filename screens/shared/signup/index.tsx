import {Box, Divider, FormControl, HStack, Select, VStack} from 'native-base';
import React, {createRef, useCallback, useEffect, useRef} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import {Colors, Headline, ProgressBar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {format} from 'date-fns';

import Button from '@components/button';
import DatePicker from '@components/input/datepicker';
import PasswordInput from '@components/input/password';
import TextInput from '@components/input/text';

import {useNavigation} from '@react-navigation/native';

import {zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// import {http} from '@utils/http';
import {Color} from '@global/utils/style';
import * as UserType from '@stores/user';
import {Type} from '@stores/user/types';

import * as z from 'zod';

import Screen from '@global/components/screen';
import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';
import {showMessage} from 'react-native-flash-message';

// import {url} from '@env';

const minPasswordLength = 4;
const minPhoneNumberLength = 11;
const maxStrengthScore = 4;

const base_schema = z.object({
  // last_name: z.string({required_error: 'Last name is required'}),
  // first_name: z.string({required_error: 'First name is required'}),
  date_of_birth: z.date({required_error: 'Date of birth is required'}),
  email: z
    .string({required_error: 'Email is required'})
    .email('Please enter a valid email'),
  password: z
    .string({required_error: 'Password is required'})
    .min(
      minPasswordLength,
      `Password must be at least ${minPasswordLength} characters`,
    ),
});

const kid_schema = z.object({
  parent_reference: z.string({required_error: 'Please enter a reference code'}),
});

const parent_schema = z.object({
  nickname: z.string({required_error: 'Please select one'}),
  last_name: z.string({required_error: 'Last name is required'}),
  first_name: z.string({required_error: 'First name is required'}),
  gender: z.string({required_error: 'Please select a gender'}),
  phone_no: z
    .string({required_error: 'Phone number is required'})
    .min(
      minPhoneNumberLength,
      `Please input a valid phone number, minimum of ${minPhoneNumberLength} characters`,
    ),
});

type ParentForm = z.infer<typeof parent_schema> & {type: Type.parent};

type KidForm = z.infer<typeof kid_schema> & {type: Type.child};

type BaseForm = z.infer<typeof base_schema> & {type: Type};

type Form = BaseForm & (ParentForm | KidForm);

type MergedForm = Omit<BaseForm, 'type'> &
  (Omit<ParentForm, 'type'> & Omit<KidForm, 'type'>);

type FormErrors = z.ZodFormattedError<MergedForm>;

// type FormData = Awaited<ReturnType<typeof login>>;

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
};

zxcvbnOptions.setOptions(options);

export default function Signup() {
  const nav = useNavigation();
  const [{context}] = UserType.useContext();

  const type = context.type!;

  const form = useRef(
    factory<Form, FormErrors, any, Error>({
      initialErrors: {},
      initialValues: {type} as any,

      onValidate(vals) {
        const data =
          type === Type.child
            ? base_schema.merge(kid_schema).safeParse(vals)
            : base_schema.merge(parent_schema).safeParse(vals);

        if (!data.success) throw data.error.format();
      },

      async onSubmit({date_of_birth, ...vals}) {
        let date = format(date_of_birth, 'yyyy-MM-dd');

        console.log(date, vals);

        // const res = await http.post('/parentapi/v1/auth/users/', {
        //   ...values,
        //   date_of_birth: date,
        // });

        return new Promise(r => {
          setTimeout(r, 3000, {});
        });

        // return login(values).catch(error => {
        //   const err =
        //     (error as AxiosError<Record<string, string[]>>).response?.data ??
        //     (error as Error);

        //   console.log(error, err, (error as any).response?.data);

        //   if (err instanceof Error && err.name === 'NetworkError') {
        //     return Promise.reject(new Error(err.message));
        //   } else {
        //     // create multiline error message from server error array response
        //     return Promise.reject(
        //       new Error(
        //         Object.values(err as Record<string, string[]>)
        //           .map(e => e.join(', '))
        //           .join('\n'),
        //       ),
        //     );
        //   }
        // });
      },
    }),
  );

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
  ] = useForm(form.current);

  const score = values.password ? zxcvbn(values.password).score : 0;

  // console.log(values.password && zxcvbn(values.password));

  console.log(data, error);

  const firstNameRef = createRef<RNTextInput>();
  const lastNameRef = createRef<RNTextInput>();

  const emailRef = createRef<RNTextInput>();
  const passwordRef = createRef<RNTextInput>();

  const setFieldValue = useCallback<
    <N extends keyof MergedForm>(name: N) => (value: MergedForm[N]) => void
  >(name => value => setValue({...values, [name]: value}), [setValue, values]);

  useEffect(() => {
    if (submitted) {
      nav.navigate('SetupWalletPassword' as any);
    }
  }, [nav, submitted]);

  useEffect(() => {
    if (submitted) {
      showMessage({type: 'success', message: 'Signup successful'});
    }
  }, [submitted]);

  useEffect(() => {
    if (isError) {
      showMessage({type: 'danger', message: 'An error occurred'});
    }
  }, [isError]);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <Screen>
        <VStack flex={1} space={6}>
          <Box alignItems="center" justifyContent="center">
            <SafeAreaView>
              <Image source={require('./header.png')} />
            </SafeAreaView>
          </Box>

          <VStack p={6} space={6}>
            <VStack space={2}>
              <Headline>Let’s Get Started</Headline>
              <Text>Please sign up to continue</Text>
            </VStack>

            <VStack space={12}>
              <VStack space={6}>
                <VStack space={4}>
                  {values.type === Type.parent && (
                    <>
                      <FormControl isInvalid={!!errors?.first_name}>
                        <TextInput
                          mode="outlined"
                          label="First Name"
                          ref={firstNameRef}
                          returnKeyType="next"
                          autoComplete="name-given"
                          value={values.first_name}
                          error={!!errors?.first_name}
                          onChangeText={setFieldValue('first_name')}
                          onSubmitEditing={() => {
                            lastNameRef.current?.focus();
                          }}
                        />

                        <FormControl.ErrorMessage>
                          {errors?.first_name?._errors.join(', ')}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors?.last_name}>
                        <TextInput
                          mode="outlined"
                          label="Last Name"
                          ref={lastNameRef}
                          value={values.last_name}
                          autoComplete="name-family"
                          error={!!errors?.last_name}
                          onChangeText={setFieldValue('last_name')}
                        />

                        <FormControl.ErrorMessage>
                          {errors?.last_name?._errors.join(', ')}
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </>
                  )}

                  <FormControl isInvalid={!!errors?.date_of_birth}>
                    <DatePicker
                      mode="outlined"
                      label="Date of Birth"
                      value={values.date_of_birth}
                      autoComplete="birthdate-full"
                      error={!!errors?.date_of_birth}
                      onChange={setFieldValue('date_of_birth')}
                    />

                    <FormControl.ErrorMessage>
                      {errors?.date_of_birth?._errors.join(', ')}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  {values.type === Type.parent && (
                    <FormControl isInvalid={!!errors?.phone_no}>
                      <TextInput
                        mode="outlined"
                        autoComplete="tel"
                        label="Phone Number"
                        returnKeyType="next"
                        value={values.phone_no}
                        keyboardType="number-pad"
                        error={!!errors?.phone_no}
                        onChangeText={setFieldValue('phone_no')}
                        onSubmitEditing={() => {
                          emailRef.current?.focus();
                        }}
                      />

                      <FormControl.ErrorMessage>
                        {errors?.phone_no?._errors.join(', ')}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  )}

                  <FormControl isInvalid={!!errors?.email}>
                    <TextInput
                      label="Email"
                      ref={emailRef}
                      mode="outlined"
                      autoComplete="email"
                      returnKeyType="next"
                      value={values.email}
                      error={!!errors?.email}
                      keyboardType="email-address"
                      onChangeText={setFieldValue('email')}
                      onSubmitEditing={() => {
                        passwordRef.current?.focus();
                      }}
                    />

                    <FormControl.ErrorMessage>
                      {errors?.email?._errors.join(', ')}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors?.password}>
                    <VStack space={1}>
                      <PasswordInput
                        mode="outlined"
                        label="Password"
                        ref={passwordRef}
                        autoComplete="off"
                        value={values.password}
                        error={!!errors?.password}
                        onChangeText={setFieldValue('password')}
                      />

                      <ProgressBar
                        style={{borderRadius: 100}}
                        progress={score / maxStrengthScore}
                        color={
                          !values.password
                            ? undefined
                            : score <= 2
                            ? Colors.red700
                            : score >= 3 && score < maxStrengthScore
                            ? Colors.amber700
                            : Colors.green700
                        }
                      />
                    </VStack>

                    <FormControl.ErrorMessage>
                      {errors?.password?._errors.join(', ')}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  {values.type === Type.parent && (
                    <FormControl isInvalid={!!errors?.gender}>
                      <Select
                        p={4}
                        bg="white"
                        fontSize={16}
                        borderRadius={10}
                        placeholder="Gender"
                        borderColor={Colors.grey400}
                        selectedValue={values.gender}
                        onValueChange={setFieldValue('gender')}>
                        <Select.Item label="Female" value="female" />
                        <Select.Item label="Male" value="male" />
                      </Select>

                      <FormControl.ErrorMessage>
                        {errors?.gender?._errors.join(', ')}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  )}

                  {values.type === Type.child && (
                    <FormControl isInvalid={!!errors?.parent_reference}>
                      <TextInput
                        mode="outlined"
                        returnKeyType="go"
                        label="Parent’s Reference Code"
                        value={values.parent_reference}
                        onSubmitEditing={() => submit()}
                        error={!!errors?.parent_reference}
                        onChangeText={setFieldValue('parent_reference')}
                      />

                      <FormControl.ErrorMessage>
                        {errors?.parent_reference?._errors.join(', ')}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  )}
                </VStack>

                {values.type === Type.parent && (
                  <VStack space={2}>
                    <Text>What do the Kids Refer to you as?</Text>

                    <FormControl isInvalid={!!errors?.nickname}>
                      <HStack
                        bg="#FAFAFA"
                        borderWidth={1}
                        borderRadius={10}
                        overflow="hidden"
                        divider={<Divider />}
                        borderColor={Colors.grey400}
                        justifyContent="space-evenly">
                        {['Mummy', 'Daddy', 'Other'].map(nickname => {
                          const selected = nickname === values.nickname;

                          return (
                            <TouchableOpacity
                              key={nickname}
                              onPress={() =>
                                setFieldValue('nickname')(nickname)
                              }
                              style={[
                                styles.nick_name,
                                selected && {backgroundColor: Colors.grey600},
                              ]}>
                              <Text
                                style={[
                                  styles.nick_name_label,
                                  selected && {color: '#fff'},
                                ]}>
                                {nickname}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </HStack>

                      <FormControl.ErrorMessage>
                        {errors?.nickname?._errors.join(', ')}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </VStack>
                )}
              </VStack>

              <VStack space={4} alignItems="center">
                <Button
                  mode="contained"
                  loading={isSubmitting}
                  onPress={() => submit()}
                  style={{minWidth: '60%'}}
                  labelStyle={{color: 'white'}}>
                  Sign Up
                </Button>

                <HStack>
                  <Text>Already have an account? </Text>

                  <TouchableOpacity
                    onPress={() => nav.navigate('Login' as any)}>
                    <Text style={{color: Color.bitterSweet}}>Sign in</Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  nick_name: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nick_name_label: {
    textTransform: 'capitalize',
  },
});
