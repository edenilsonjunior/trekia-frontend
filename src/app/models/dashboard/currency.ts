export type Currency = {
  amount: number;
  base: string;
  date: string;
  rates: {
    [currencyCode: string]: number;
  };
  brazilianReal: number;
}