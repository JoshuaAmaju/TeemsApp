import React from 'react';
import Store from '@react-native-async-storage/async-storage';

import * as O from 'fp-ts/Option';
import {constFalse, identity, pipe} from 'fp-ts/lib/function';

import {useActor} from '@xstate/react';
import {
  BaseActionObject,
  createMachine,
  interpret,
  Interpreter,
  ResolveTypegenMeta,
  ServiceMap,
  TypegenDisabled,
} from 'xstate';

import {safeParse} from '@utils/json';

export const Key = '@teems/onboarding';

export enum Action {
  hydrate = 'hydrate',
  complete = 'complete',
}

export enum State {
  idle = 'idle',
  unknown = 'unknown',
  hydrating = 'hydrating',
  onboarded = 'onboarded',
  notOnboarded = 'notOnboarded',
}

type Ctx = {};

type Events = {type: Action};

type States =
  | {
      value: State.onboarded | State.notOnboarded;
      context: Ctx;
    }
  | {
      value: State.unknown | {[State.unknown]: State.hydrating};
      context: Ctx;
    };

export const config = createMachine<Ctx, Events, States>(
  {
    id: 'root',
    initial: State.unknown,

    states: {
      [State.unknown]: {
        initial: State.hydrating,
        states: {
          [State.hydrating]: {
            invoke: {
              src: 'hydrate',
              onDone: [
                {
                  target: '#' + State.onboarded,
                  cond: (_, {data}) => data === true,
                },
                {
                  target: '#' + State.notOnboarded,
                },
              ],
            },
          },
        },
      },
      [State.notOnboarded]: {
        id: State.notOnboarded,
        on: {
          [Action.complete]: {
            target: State.onboarded,
            actions: () => {
              Store.setItem(Key, JSON.stringify(true));
            },
          },
        },
      },
      [State.onboarded]: {
        type: 'final',
        id: State.onboarded,
      },
    },
  },
  {
    services: {
      async hydrate() {
        const json = await Store.getItem(Key);

        return pipe(
          json,
          O.fromNullable,
          O.chain(n => safeParse<boolean>(n)),
          O.fold(constFalse, identity),
        );
      },
    },
  },
);

export function create() {
  return interpret(config).start();
}

/* ------------------------------ React context ----------------------------- */
// Passes down a reference to the state machine
export const Context = React.createContext<
  Interpreter<
    Ctx,
    States,
    Events,
    States,
    ResolveTypegenMeta<TypegenDisabled, Events, BaseActionObject, ServiceMap>
  >
>(undefined as any);

export const {Provider} = Context;

export function useContext() {
  return useActor(React.useContext(Context));
}
