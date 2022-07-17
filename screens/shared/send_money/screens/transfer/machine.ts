import {createMachine} from 'xstate';

type Ctx = {};

type Events = {type: 'start' | 'next' | 'cancel' | 'done'};

type States = {
  context: Ctx;
  value: 'collectInfo' | 'enterPin' | 'confirmInfo' | 'confirmTransfer';
};

export const config = createMachine<Ctx, Events, States>({
  initial: 'collectInfo',

  on: {
    cancel: 'collectInfo',
  },

  states: {
    collectInfo: {
      on: {
        start: 'enterPin',
      },
    },

    enterPin: {
      on: {
        next: 'confirmInfo',
      },
    },

    confirmInfo: {
      on: {
        next: 'confirmTransfer',
      },
    },

    confirmTransfer: {
      on: {
        done: 'collectInfo',
      },
    },
  },
});
