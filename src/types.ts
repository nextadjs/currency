export interface CurrencyRates {
  /** ISO 4217 Currency Code (Example: USD, JPY, EUR) */
  [currency: string]: number;
}

export interface ConversionRates {
  /** convert rate of base currency */
  [baseCurrency: string]: CurrencyRates;
}

export interface CurrencyConversionData {
  dataAsOf: string;
  generatedAt: string;
  conversions: ConversionRates;
}
