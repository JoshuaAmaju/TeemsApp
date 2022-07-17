import Intl from 'intl';
import 'intl/locale-data/jsonp/en';

const currency = new Intl.NumberFormat('en-NG', {
  currency: 'NGN',
  style: 'currency',
});

export const format = (amount: number) => currency.format(amount);
