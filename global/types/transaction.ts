export enum Type {
  Debit = 'DEBIT',
  Credit = 'CREDIT',
}

export enum Status {
  Success = 'SUCCESSFUL',
  InProgress = 'IN PROGRESS',
}

export enum Category {
  Airtime = 'AIRTIME',
  SentMoney = 'SENT MONEY',
  RecievedMoney = 'RECIEVED MONEY',
}

export type Transaction = {
  fees: string;
  timestamp: string;
  narration: string;
  transaction_id: string;
  transaction_type: Type;
  sender_bank_name: string;
  transaction_status: Status;
  transaction_amount: string;
  recipient_bank_name: string;
  sender_account_name: string;
  transaction_reference: string;
  sender_account_number: string;
  recipient_account_name: string;
  transaction_category: Category;
  inter_bank_transaction: boolean;
  recipient_account_number: string;
};
