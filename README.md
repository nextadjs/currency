# Currency Exchange Rates API

Daily currency exchange rates data sourced from the European Central Bank (ECB), providing accurate conversion rates for major world currencies.

## Features

- Automatic daily updates from ECB reference rates
- Cross-rate calculations for all currency pairs
- Consistent JSON format with TypeScript type definitions
- Highly compressed data format for efficient distribution

## Data Format

The exchange rates are provided in two formats:

1. `latest.json` - Complete cross-rates for all currency pairs:

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

2. `latest.min.json` - USD-based rates only (smaller file size):

```javascript
{
  "dataAsOf": "2025-01-20",        // ECB reference date
  "generatedAt": "...",            // Generation timestamp
  "rates": {
    "USD": {                       // USD-based conversion rates
      "EUR": 0.9693,
      "JPY": 155.82,               
    } 
    ...
  }
}
```

## Usage

Complete cross-rates are available at:
`https://cdn.jsdelivr.net/gh/nextadjs/currency@1/latest.json`

For USD-only rates (smaller file), use:
`https://cdn.jsdelivr.net/gh/nextadjs/currency@1/latest.min.json`

The data is updated daily at 16:00 UTC, following the ECB reference rate publication.

## Supported Currencies

Includes major world currencies such as EUR, USD, JPY, GBP, and many others as provided by the ECB daily reference rates.
