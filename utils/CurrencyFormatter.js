import * as currencyFormatter from 'currency-formatter';

const CurrencyFormatter = (number) => {
  const formattedNumber = currencyFormatter.format(number, { locale: 'id-ID' });

  return formattedNumber;
};

export default CurrencyFormatter;
