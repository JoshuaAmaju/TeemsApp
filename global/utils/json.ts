import * as O from 'fp-ts/Option';

export function safeParse<T>(...args: Parameters<JSON['parse']>): O.Option<T> {
  return O.tryCatch(() => JSON.parse(...args));
}
