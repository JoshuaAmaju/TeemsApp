import {useCallback} from 'react';

// xstate
import {useMachine} from '@xstate/react';
import {StateMachine} from 'xstate';

// form
import {Ctx, Events, States, SetType} from './types';

export function useForm<
  Vs = unknown,
  Es = unknown,
  D = unknown,
  E = unknown,
  S extends SetType<Vs, Es, D, E> = SetType<Vs, Es, D, E>,
>(
  form: StateMachine<
    Ctx<Vs, Es, D, E>,
    States<Vs, Es, D, E>,
    Events<Vs, Es, D, E>,
    States<Vs, Es, D, E>
  >,
) {
  const [current, send, service] = useMachine(form);

  const {values, data, error, errors} = current.context;

  const isIdle = current.matches('idle');
  const isError = current.matches('error');
  const submitted = current.matches('submitted');
  const isSubmitting =
    current.matches('validating') || current.matches('submitting');

  const submit = useCallback(
    function submitForm() {
      const subscription = service.subscribe(state => {
        if (state.matches('idle') && state.history?.matches('validating')) {
          send('submit');
          subscription.unsubscribe();
        }
      });

      send('validate');
    },
    [send, service],
  );

  const setValue = useCallback<
    (value: Extract<S, {name: 'values'}>['value']) => void
  >(
    value => {
      send({type: 'set', name: 'values', value});
    },
    [send],
  );

  return [
    {
      isError,
      isIdle,
      isSubmitting,
      submitted,
      values,
      data,
      error,
      errors,
      submit,
      setValue,
    },
    send,
    service,
  ] as const;
}
