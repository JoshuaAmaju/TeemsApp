export type Ctx<Vs = unknown, Es = unknown, D = unknown, E = unknown> = {
  values: Vs;
  data?: D | null;
  error?: E | null;
  errors: Es | null;
};

export type States<Vs, Es, D, E> =
  | {value: 'idle' | 'validating' | 'submitting'; context: Ctx<Vs, Es, D, E>}
  | {value: 'error'; context: Ctx<Vs, Es, D, E> & {error: unknown}}
  | {value: 'submitted'; context: Ctx<Vs, Es, D, E> & {data: unknown}};

export type SetType<Vs, Es, D, E> =
  | {name: 'data'; value: Ctx<Vs, Es, D, E>['data']}
  | {name: 'error'; value: Ctx<Vs, Es, D, E>['error']}
  | {name: 'values'; value: Ctx<Vs, Es, D, E>['values']}
  | {name: 'errors'; value: Ctx<Vs, Es, D, E>['errors']};

export type Events<Vs, Es, D, E> =
  | {type: 'submit' | 'validate'}
  | ({type: 'set'} & SetType<Vs, Es, D, E>);
