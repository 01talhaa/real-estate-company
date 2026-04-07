import fs from 'fs/promises';
import path from 'path';

const endpoints = [
  { url: 'http://localhost:3000/api/services', file: 'services.json' },
  { url: 'http://localhost:3000/api/properties', file: 'properties.json' },
  { url: 'http://localhost:3000/api/insights', file: 'insights.json' },
  { url: 'http://localhost:3000/api/team', file: 'team.json' },
];

async function exportData() {
  const dataDir = path.resolve('data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }

  for (const ep of endpoints) {
    try {
      console.log(`Fetching ${ep.url}...`);
      const response = await fetch(ep.url);
      if (!response.ok) {
        console.error(`Failed to fetch ${ep.url}: ${response.statusText}`);
        continue;
      }
      const data = await response.json();
      const extractedData = data.success !== undefined ? data.data : data;
      
      const filePath = path.join(dataDir, ep.file);
      await fs.writeFile(filePath, JSON.stringify(extractedData, null, 2), 'utf-8');
      console.log(`Saved ${ep.file}`);
    } catch (err) {
      console.error(`Error processing ${ep.url}:`, err);
    }
  }
}

exportData();
