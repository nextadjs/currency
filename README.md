# Currency Exchange Rates API v1.0.0

Daily currency exchange rates data sourced from the European Central Bank (ECB), providing accurate conversion rates for major world currencies.

## Features
- Automatic daily updates from ECB reference rates
- Cross-rate calculations for all currency pairs
- Consistent JSON format with TypeScript type definitions
- Highly compressed data format for efficient distribution

## Data Format

The exchange rates are provided in `latest.json` with the following structure:
```javascript
{
  "dataAsOf": "2025-01-20",        // ECB reference date
  "generatedAt": "...",            // Generation timestamp
  "conversions": {                  // All currency pair rates
    "EUR": { "USD": 1.0316, ... },
    "USD": { "EUR": 0.9693, ... },
    ...
  }
}
```

## Usage

Simply fetch the latest.json file from the `https://cdn.jsdelivr.net/gh/nextadjs/currency@1/latest.json` to get the most recent exchange rates. The data is updated daily at 16:00 UTC, following the ECB reference rate publication.

## Supported Currencies

Includes major world currencies such as EUR, USD, JPY, GBP, and many others as provided by the ECB daily reference rates.