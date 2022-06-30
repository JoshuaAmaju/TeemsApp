export enum Type {
  Child = 'child',
  Parent = 'parent',
  Unknown = 'unknown',
}

export type Info = {
  id: string;
  code: string;
  email: string;
  gender: string;
  nickname: string;
  phone_no: string;
  last_name: string;
  is_active: boolean;
  first_name: string;
  user_type: 'parent';
  date_joined: string;
  bvn_verified: boolean;
  date_of_birth: string;
  phone_no_verified: boolean;
  child_account_slots: number;
};
