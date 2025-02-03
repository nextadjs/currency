import fs from 'fs/promises';
import path from 'path';
import { convertECBXmlToJson, createMinimalUsdRates } from './converter';

const ECB_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
const OUTPUT_FILE = path.join(process.cwd(), 'latest.json');
const MIN_OUTPUT_FILE = path.join(process.cwd(), 'latest.min.json');

async function main() {
  try {
    // Fetch latest rates from ECB
    const response = await fetch(ECB_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlData = await response.text();

    // Convert to our format
    const conversionData = await convertECBXmlToJson(xmlData);

    // Create minimal USD-only data
    const minimalData = createMinimalUsdRates(conversionData);


    // Ensure data directory exists
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

    // Write to file
    await Promise.all([
      fs.writeFile(OUTPUT_FILE, JSON.stringify(conversionData)),
      fs.writeFile(MIN_OUTPUT_FILE, JSON.stringify(minimalData))
    ]);

    console.log('Successfully updated currency conversion rates');
  } catch (error) {
    console.error('Error updating currency rates:', error);
    process.exit(1);
  }
}

main();