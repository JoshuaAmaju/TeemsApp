import {assign, createMachine} from 'xstate';
import {Ctx, Events, States} from './types';

export const factory = <Vs = unknown, Es = unknown, D = unknown, E = unknown>({
  onSubmit,
  onValidate,
  initialValues,
  initialErrors,
}: {
  onValidate: (values: Vs) => unknown;
  onSubmit: (values: Vs) => Promise<D>;
  initialErrors?: Es extends object ? Partial<Es> : Es;
  initialValues?: Es extends object ? Partial<Vs> : Vs;
}) => {
  return createMachine<
    Ctx<Vs, Es, D, E>,
    Events<Vs, Es, D, E>,
    States<Vs, Es, D, E>
  >(
    {
      initial: 'idle',

      context: {
        errors: initialErrors as any,
        values: initialValues as any,
      },

      on: {
        set: [
          {
            target: 'idle',
            actions: 'setValues',
            cond: (_, {name}) => name === 'values',
          },
          {
            in: 'idle',
            target: 'idle',
            actions: 'setErrors',
            cond: (_, {name}) => name === 'errors',
          },
          {
            in: 'error',
            target: 'idle',
            actions: 'setError',
            cond: (_, {name}) => name === 'error',
          },
          {
            target: 'idle',
            in: 'submitted',
            actions: 'setData',
            cond: (_, {name}) => name === 'data',
          },
        ],
      },

      states: {
        idle: {
          on: {
            validate: 'validating',

            submit: {
              target: 'submitting',
              cond: ({errors}) => errors === null || errors === undefined,
            },
          },
        },

        validating: {
          invoke: {
            src: 'onValidate',
            onDone: {
              target: 'idle',
              actions: 'clearErrors',
            },
            onError: {
              target: 'idle',
              actions: 'setErrors',
            },
          },
        },
        submitting: {
          entry: ['clearErrors', 'clearData', 'clearError'],

          invoke: {
            src: 'onSubmit',
            onDone: {
              target: 'submitted',
              actions: 'setData',
            },
            onError: {
              target: 'error',
              actions: 'setError',
            },
          },
        },
        submitted: {},
        error: {
          on: {
            submit: 'submitting',
            validate: 'validating',
          },
        },
      },
    },
    {
      services: {
        onSubmit: ({values}) => onSubmit(values),
        onValidate: async ({values}) => {
          const errors = await onValidate(values);
          return errors !== null && errors !== undefined
            ? Promise.reject(errors)
            : null;
        },
      },
      actions: {
        setErrors: assign({
          errors: (_, e: any) => e.data ?? e.value,
        }),

        setValues: assign({
          values: (_, e: any) => e.data ?? e.value,
        }),

        setError: assign({
          error: (_, e: any) => e.data ?? e.value,
        }),

        setData: assign({
          data: (_, e: any) => e.data ?? e.value,
        }),

        clearErrors: assign({
          errors: _ => null,
        }),

        clearData: assign({
          data: _ => null,
        }),

        clearError: assign({
          error: _ => null,
        }),
      },
    },
  );
};
