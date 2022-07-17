import {http} from '@utils/http';
import {Transaction} from '@global/types/transaction';

import * as T from 'fp-ts/Task';

type TransactionsResponse = {
  next: string;
  count: number;
  previous: null;
  results: Transaction[];
};

export function get_transactions(): T.Task<TransactionsResponse> {
  // return () => http.get('/parentapi/v1/transactions/');
  return () =>
    new Promise(r => {
      setTimeout(r, 3000, {
        next: '',
        count: 0,
        results: [
          {
            narration: 'fjkgf',
            transaction_id: 'jfklgf',
            transaction_type: 'DEBIT',
            transaction_amount: '500',
            timestamp: new Date().toJSON(),
            transaction_category: 'AIRTIME',
          },
        ],
      });
    });
}

export function get_transaction(id: string): T.Task<Transaction> {
  return () => http.get(`/parentapi/v1/transactions/${id}/`);
}
