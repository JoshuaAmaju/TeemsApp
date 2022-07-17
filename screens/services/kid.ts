import {http} from '@global/utils/http';

export async function get_kids(): Promise<{
  next: null;
  count: number;
  previous: null;
  results: [];
}> {
  const res = await http.get('/parentapi/v1/users/kids/');
  return res as any;
}

export async function get_kid(kid_code: string): Promise<{
  next: null;
  count: number;
  previous: null;
  results: [];
}> {
  const res = await http.get(`/parentapi/v1/users/kid-details/${kid_code}/
`);
  return res as any;
}
