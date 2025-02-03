import { parseStringPromise } from "xml2js";
import { CurrencyConversionData } from "./types";

export async function convertECBXmlToJson(
  xmlData: string
): Promise<CurrencyConversionData> {
  const result = await parseStringPromise(xmlData, {
    explicitArray: false,
    ignoreAttrs: false,
  });

  const cube = result["gesmes:Envelope"].Cube.Cube;
  const date = cube.$?.time;
  const rates = cube.Cube;

  // Create rates object with EUR as base
  const eurRates: { [key: string]: number } = {
    EUR: 1, // Adding EUR as base currency
  };

  rates.forEach((rate: any) => {
    eurRates[rate.$.currency] = parseFloat(rate.$.rate);
  });

  // Calculate cross rates for all currencies
  const conversions: { [key: string]: { [key: string]: number } } = {};

  Object.keys(eurRates).forEach((baseCurrency) => {
    const baseRate = eurRates[baseCurrency];
    const rates: { [key: string]: number } = {};

    Object.entries(eurRates).forEach(([currency, rate]) => {
      rates[currency] = parseFloat((rate / baseRate).toFixed(6));
    });

    conversions[baseCurrency] = rates;
  });

  return {
    dataAsOf: date,
    generatedAt: new Date().toISOString(),
    conversions,
  };
}

export function createMinimalUsdRates(data: CurrencyConversionData) {
  const { dataAsOf, generatedAt, conversions } = data;
  return {
    dataAsOf,
    generatedAt,
    rates: {
      USD: conversions['USD']
    }
  };
}