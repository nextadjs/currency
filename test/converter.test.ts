import { expect, describe, it } from "vitest";
import { convertECBXmlToJson, createMinimalUsdRates } from "../src/converter";
import { CurrencyConversionData } from "../src/types";

describe("converter", () => {
  const createXmlData = (
    time: string = "2025-01-20",
    rates: Array<{ currency: string; rate: string }> = []
  ) => `<?xml version="1.0" encoding="UTF-8"?>
        <gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
          <gesmes:subject>Reference rates</gesmes:subject>
          <gesmes:Sender><gesmes:name>European Central Bank</gesmes:name></gesmes:Sender>
          <Cube>
            <Cube time='${time}'>
              ${rates
                .map((r) => `<Cube currency='${r.currency}' rate='${r.rate}'/>`)
                .join("\n          ")}
            </Cube>
          </Cube>
        </gesmes:Envelope>`;

  it("includes EUR as base currency", async () => {
    const xmlData = createXmlData("2025-01-20", [
      { currency: "USD", rate: "1.0316" },
      { currency: "JPY", rate: "161.36" },
    ]);

    const result = await convertECBXmlToJson(xmlData);

    expect(result).toHaveProperty("conversions");
    expect(result?.conversions).toHaveProperty("EUR");
  });

  it("sets dataAsOf correctly to current date", async () => {
    const xmlData = createXmlData("2025-01-20", [
      { currency: "USD", rate: "1.0316" },
      { currency: "JPY", rate: "161.36" },
    ]);

    const result = await convertECBXmlToJson(xmlData);

    expect(result).toHaveProperty("dataAsOf", "2025-01-20");
  });

  it("sets generatedAt to current ISOString timestamp", async () => {
    const xmlData = createXmlData("2025-01-20", [
      { currency: "USD", rate: "1.0316" },
      { currency: "JPY", rate: "161.36" },
    ]);

    const result = await convertECBXmlToJson(xmlData);

    expect(result.generatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

  it("calculates correct rate based on EUR currency", async () => {
    const xmlData = createXmlData("2025-01-20", [
      { currency: "USD", rate: "1.0316" },
      { currency: "JPY", rate: "161.36" },
    ]);

    const result = await convertECBXmlToJson(xmlData);

    expect(result.conversions.EUR).toEqual({
      EUR: 1,
      USD: 1.0316,
      JPY: 161.36,
    });
  });

  it("calculates correct cross rates", async () => {
    const xml = createXmlData("2025-01-20", [
      { currency: "USD", rate: "2.0000" },
      { currency: "JPY", rate: "200.0000" },
    ]);

    const result = await convertECBXmlToJson(xml);

    // 200/2 = 100 for USD -> JPY rate
    expect(result.conversions.USD.JPY).toBe(100);
    // 2/200 = 0.01 for JPY -> USD rate
    expect(result.conversions.JPY.USD).toBe(0.01);
  });

  it("calculates to six decimal places", async () => {
    const xml = createXmlData("2025-01-20", [
      { currency: "USD", rate: "1.234567890" },
      { currency: "JPY", rate: "123.456789" },
    ]);

    const result = await convertECBXmlToJson(xml);

    expect(result.conversions.EUR.USD.toString()).toMatch(/^\d+\.\d{1,6}$/);
  });
});

describe("createMinimalUsdRates", () => {
  it("creates minimal USD-only rates format", () => {
    const fullData: CurrencyConversionData = {
      dataAsOf: "2025-01-20",
      generatedAt: "2025-01-20T16:00:00.000Z",
      conversions: {
        USD: {
          EUR: 0.957579,
          USD: 1,
          JPY: 155.817294,
        },
        EUR: {
          /* ... */
        },
        JPY: {
          /* ... */
        },
      },
    };

    const result = createMinimalUsdRates(fullData);

    expect(result).toEqual({
      dataAsOf: "2025-01-20",
      generatedAt: "2025-01-20T16:00:00.000Z",
      rates: {
        USD: {
          EUR: 0.957579,
          USD: 1,
          JPY: 155.817294,
        },
      },
    });
  });
});
