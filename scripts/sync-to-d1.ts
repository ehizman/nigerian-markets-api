/**
 * Syncs JSON data files to Cloudflare D1.
 *
 * This script reads all state JSON files from data/states/ and uses the
 * Cloudflare D1 HTTP API to rebuild the database. It runs in CI after
 * any changes to data/ are merged to main.
 *
 * Required env vars:
 *   CLOUDFLARE_API_TOKEN
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_DATABASE_ID
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { StateData } from '../types';

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;

if (!API_TOKEN || !ACCOUNT_ID || !DATABASE_ID) {
  console.error('Missing required env vars: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID');
  process.exit(1);
}

const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}`;

async function execSQL(sql: string, params: unknown[] = []) {
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`D1 API error (${res.status}): ${text}`);
  }

  return res.json();
}

async function main() {
  const dataDir = join(process.cwd(), 'data', 'states');
  const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'));

  // Read all data
  const allStates: StateData[] = files.map((f) =>
    JSON.parse(readFileSync(join(dataDir, f), 'utf-8'))
  );

  console.log(`Syncing ${allStates.length} states to D1...`);

  // Clear existing data (order matters for foreign keys)
  await execSQL('DELETE FROM markets');
  await execSQL('DELETE FROM lgas');
  await execSQL('DELETE FROM states');

  // Insert states
  for (const state of allStates) {
    await execSQL('INSERT INTO states (name, slug) VALUES (?, ?)', [state.name, state.slug]);
  }

  // Insert LGAs
  for (const state of allStates) {
    for (const lga of state.lgas) {
      await execSQL(
        'INSERT INTO lgas (state_id, name, slug) VALUES ((SELECT id FROM states WHERE slug = ?), ?, ?)',
        [state.slug, lga.name, lga.slug]
      );
    }
  }

  // Insert markets
  for (const state of allStates) {
    for (const lga of state.lgas) {
      for (const market of lga.markets) {
        await execSQL(
          'INSERT INTO markets (lga_id, name, slug, lat, lng, added_by) VALUES ((SELECT id FROM lgas WHERE slug = ?), ?, ?, ?, ?, ?)',
          [
            lga.slug,
            market.name,
            market.slug,
            market.coordinates?.lat ?? null,
            market.coordinates?.lng ?? null,
            market.added_by ?? null,
          ]
        );
      }
    }
  }

  // Count totals
  let totalMarkets = 0;
  let totalLGAs = 0;
  for (const state of allStates) {
    totalLGAs += state.lgas.length;
    for (const lga of state.lgas) {
      totalMarkets += lga.markets.length;
    }
  }

  console.log(`Synced: ${allStates.length} states, ${totalLGAs} LGAs, ${totalMarkets} markets`);
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
