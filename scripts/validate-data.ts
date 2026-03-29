import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { StateData } from '../types';

const dataDir = join(process.cwd(), 'data', 'states');
const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'));

let errors: string[] = [];
const allSlugs = new Set<string>();

function validateSlug(slug: string, context: string) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`${context}: invalid slug "${slug}" (must be lowercase alphanumeric with hyphens)`);
  }
  if (allSlugs.has(slug)) {
    errors.push(`${context}: duplicate slug "${slug}"`);
  }
  allSlugs.add(slug);
}

function validateCoordinates(lat: number, lng: number, context: string) {
  // Nigeria roughly: lat 4-14, lng 2-15
  if (lat < 3 || lat > 15) {
    errors.push(`${context}: latitude ${lat} is outside Nigeria's range (3-15)`);
  }
  if (lng < 1 || lng > 16) {
    errors.push(`${context}: longitude ${lng} is outside Nigeria's range (1-16)`);
  }
}

for (const file of files) {
  const filePath = join(dataDir, file);
  const expectedSlug = file.replace('.json', '');

  let data: StateData;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    errors.push(`${file}: invalid JSON`);
    continue;
  }

  // Validate state
  if (!data.name) errors.push(`${file}: missing state name`);
  if (!data.slug) errors.push(`${file}: missing state slug`);
  if (data.slug !== expectedSlug) {
    errors.push(`${file}: slug "${data.slug}" doesn't match filename "${expectedSlug}"`);
  }
  validateSlug(data.slug, `${file} (state)`);

  if (!Array.isArray(data.lgas)) {
    errors.push(`${file}: missing or invalid lgas array`);
    continue;
  }

  for (const lga of data.lgas) {
    const lgaContext = `${file} > ${lga.name || 'unnamed LGA'}`;

    if (!lga.name) errors.push(`${lgaContext}: missing LGA name`);
    if (!lga.slug) errors.push(`${lgaContext}: missing LGA slug`);
    validateSlug(lga.slug, lgaContext);

    if (!Array.isArray(lga.markets)) {
      errors.push(`${lgaContext}: missing or invalid markets array`);
      continue;
    }

    for (const market of lga.markets) {
      const mContext = `${lgaContext} > ${market.name || 'unnamed market'}`;

      if (!market.name) errors.push(`${mContext}: missing market name`);
      if (!market.slug) errors.push(`${mContext}: missing market slug`);
      validateSlug(market.slug, mContext);

      if (market.coordinates) {
        if (typeof market.coordinates.lat !== 'number' || typeof market.coordinates.lng !== 'number') {
          errors.push(`${mContext}: coordinates must be numbers`);
        } else {
          validateCoordinates(market.coordinates.lat, market.coordinates.lng, mContext);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error(s):\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(`Validation passed: ${files.length} states, all data valid.`);
}
