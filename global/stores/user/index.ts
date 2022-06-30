import React from 'react';
import * as O from 'fp-ts/Option';
import {pipe, constNull, identity} from 'fp-ts/lib/function';
import Store from '@react-native-async-storage/async-storage';

import {
  assign,
  interpret,
  createMachine,
  Interpreter,
  ResolveTypegenMeta,
  BaseActionObject,
  ServiceMap,
  TypegenDisabled,
} from 'xstate';
import {useActor} from '@xstate/react';
import {safeParse} from '@utils/json';

import {Type, Info} from './types';

export const Key = '@teems/user';

export enum Action {
  login = 'login',
  logout = 'logout',
  setType = 'setType',
}

export enum State {
  unknown = 'unknown',
  hydrating = 'hydrating',
  authenticated = 'authenticated',
  notAuthenticated = 'notAuthenticated',
}

type Ctx = {
  type?: Type;
  data?: Info | null;
  token?: string | null;
};

type Events =
  | {type: Action.logout}
  | {type: Action.setType; data: {type: Type}}
  | {type: Action.login; data: {token: string; data: Info}};

type States =
  | {value: State.authenticated | State.notAuthenticated; context: Ctx}
  | {
      value: State.unknown | {[State.unknown]: State.hydrating};
      context: Ctx;
    };

export const config = createMachine<Ctx, Events, States>(
  {
    id: 'root',

    // Initially enter the `unknown` state, given I don't know yet what
    // the authentication state of the user is, most likely because the app
    // just launched and I need to check the device store for the last saved
    // authentication state
    initial: State.unknown,

    context: {
      type: Type.Unknown,
    },

    states: {
      [State.unknown]: {
        initial: State.hydrating,

        states: {
          [State.hydrating]: {
            invoke: {
              src: 'hydrate',
              onDone: [
                {
                  actions: 'mergeContext',
                  target: '#' + State.authenticated,
                  cond: (_, {data}) => data !== null && data !== undefined,
                },
                {
                  target: '#root.' + State.notAuthenticated,
                },
              ],
            },
          },
        },
      },
      [State.notAuthenticated]: {
        id: State.notAuthenticated,
        on: {
          [Action.setType]: {
            actions: 'mergeContext',
          },

          [Action.login]: {
            target: State.authenticated,
            actions: [
              'mergeContext',
              ({type}, {data}) => {
                Store.setItem(Key, JSON.stringify({...data, type}));
              },
            ],
          },
        },
      },
      [State.authenticated]: {
        id: State.authenticated,
        on: {
          [Action.logout]: {
            target: State.notAuthenticated,
            actions: [
              'reset',
              () => {
                Store.removeItem(Key);
              },
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      reset: assign(_ => ({type: Type.Unknown})),
      mergeContext: assign((_, {data}: any) => ({..._, ...data})),
    },
    services: {
      async hydrate() {
        const str = await Store.getItem(Key);

        return pipe(
          str,
          O.fromNullable,
          O.chain(n => safeParse(n)),
          O.fold(constNull, identity),
        );
      },
    },
  },
);

export const service = interpret(config).start();

/* ------------------------------ React context ----------------------------- */
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
