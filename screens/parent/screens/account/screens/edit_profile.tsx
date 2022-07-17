import Button from '@components/button';
import TextInput from '@components/input/text';
import {FormControl, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {http} from '@utils/http';
import * as UserStore from '@stores/user';

// form
import * as z from 'zod';
import {factory} from '@lib/form';
import {useForm} from '@lib/form/hook';

const profile = z.object({
  phone_no: z.string(),
});

type Form = z.infer<typeof profile>;

type FormErrors = z.ZodFormattedError<Form>;

export default function EditProfile() {
  const [{context}] = UserStore.useContext();

  const {phone_no} = context.data ?? {};

  const [
    {data, error, errors, values, submit, isError, setValue, isSubmitting},
  ] = useForm(
    factory<Form, FormErrors, unknown, Error>({
      initialErrors: {},

      initialValues: {phone_no},

      onValidate(vals) {
        const d = profile.safeParse(vals);
        if (!d.success) throw d.error.format();
      },

      onSubmit(vals) {
        return http.put('/parentapi/v1/auth/users/set_password/', vals);
      },
    }),
  );

  // useEffect(() => {
  //   if (submitted) {
  //     showMessage({
  //       type: 'success',
  //       message: 'Profile updated successfully',
  //     })
  //   }
  // }, [data, submitted])

  useEffect(() => {
    if (isError) {
      showMessage({
        type: 'danger',
        message: 'An error occurred, please try again later.',
      });
    }
  }, [error, isError]);

  console.log(data, error);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: '#fff'}}
      contentContainerStyle={{padding: 24, minHeight: '100%'}}>
      <VStack space={2} flex={1} justifyContent="space-between">
        <VStack space={5}>
          <FormControl isRequired isInvalid={!!errors?.phone_no}>
            <TextInput
              mode="outlined"
              label="Phone Number"
              style={styles.input}
              value={values.phone_no}
              keyboardType="phone-pad"
              onChangeText={no => {
                setValue({...values, phone_no: no});
              }}
            />

            <FormControl.ErrorMessage>
              * {errors?.phone_no?._errors.join(', ')}
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
