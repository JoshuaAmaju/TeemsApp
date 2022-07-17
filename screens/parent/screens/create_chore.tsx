import {FormControl, VStack} from 'native-base';
import React, {createRef, useCallback, useRef} from 'react';
import {StyleSheet, TextInput as RNTextInput} from 'react-native';

import TextInput from '@components/input/text';
import Button from '@global/components/button';
import TextArea from '@global/components/input/textarea';

import * as z from 'zod';
import * as currency from '@utils/currency';

import Screen from '@global/components/screen';
import Success from '@global/components/success';
import {http} from '@global/utils/http';
import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';
import {Caption, Title} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';

const schema = z.object({
  name: z.string(),
  note: z.string(),
  monetary_reward: z.string(),
});

type Form = z.infer<typeof schema> & {kid_code: string};

type Errors = z.ZodFormattedError<Form>;

type Error = {error: string};

export default function CreateChore() {
  const noteRef = createRef<RNTextInput>();
  const rewardRef = createRef<RNTextInput>();

  const {kid} = useRoute().params as {kid: string};

  const form = useRef(
    factory<Form, Errors, any, Error>({
      initialErrors: {},
      initialValues: {
        kid_code: kid,
      },

      onValidate({monetary_reward, ...vals}) {
        const data = schema.safeParse({
          ...vals,
          monetary_reward: parseFloat(monetary_reward),
        });

        if (!data.success) throw data.error.format();
      },

      async onSubmit(vals) {
        const res = await http.post('/parentapi/v1/chores/', vals);

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
            <FormControl isInvalid={!!errors?.name}>
              <TextInput
                mode="outlined"
                value={values.name}
                returnKeyType="next"
                label="Name of chore"
                error={!!errors?.name}
                onChangeText={setFieldValue('name')}
                onSubmitEditing={() => noteRef.current?.focus()}
              />

              <FormControl.ErrorMessage>
                {errors?.name?._errors.join(', ')}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors?.note}>
              <TextArea
                mode="outlined"
                value={values.note}
                returnKeyType="next"
                error={!!errors?.note}
                label="Narration / Note"
                onChangeText={setFieldValue('note')}
                onSubmitEditing={() => rewardRef.current?.focus()}
              />

              <FormControl.ErrorMessage>
                {errors?.note?._errors.join(', ')}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors?.monetary_reward}>
              <VStack space={1}>
                <TextInput
                  label="Reward"
                  mode="outlined"
                  value={values.monetary_reward}
                  onSubmitEditing={() => submit()}
                  error={!!errors?.monetary_reward}
                  onChangeText={setFieldValue('monetary_reward')}
                />

                <Caption>
                  {currency.format(parseFloat(values.monetary_reward ?? '0'))}
                </Caption>
              </VStack>

              <FormControl.ErrorMessage>
                {errors?.monetary_reward?._errors.join(', ')}
              </FormControl.ErrorMessage>
            </FormControl>
          </VStack>

          <Button
            loading={isSubmitting}
            onPress={() => submit()}
            style={{alignSelf: 'center'}}>
            Continue
          </Button>
        </VStack>
      </Screen>

      {submitted && (
        <Success>
          <Title>Chores Created</Title>
        </Success>
      )}

      {isError && error && (
        <Success>
          <VStack space={2}>
            <Title>Chores Created</Title>

            <Button
              mode="outlined"
              onPress={() => {
                setFieldValue('note')(values.note);
              }}>
              Dismiss
            </Button>
          </VStack>
        </Success>
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
