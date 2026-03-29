import type { State, LGA, Market } from '../types';

export async function getStates(db: D1Database): Promise<State[]> {
  const { results } = await db.prepare('SELECT * FROM states ORDER BY name').all<State>();
  return results;
}

export async function getStateBySlug(db: D1Database, slug: string) {
  const state = await db.prepare('SELECT * FROM states WHERE slug = ?').bind(slug).first<State>();
  if (!state) return null;

  const { results: lgas } = await db
    .prepare('SELECT * FROM lgas WHERE state_id = ? ORDER BY name')
    .bind(state.id)
    .all<LGA>();

  return { ...state, lgas };
}

export async function getLGABySlug(db: D1Database, slug: string) {
  const lga = await db.prepare('SELECT * FROM lgas WHERE slug = ?').bind(slug).first<LGA>();
  if (!lga) return null;

  const state = await db.prepare('SELECT * FROM states WHERE id = ?').bind(lga.state_id).first<State>();

  const { results: markets } = await db
    .prepare('SELECT * FROM markets WHERE lga_id = ? ORDER BY name')
    .bind(lga.id)
    .all<Market>();

  return { ...lga, state, markets };
}

export async function getMarkets(
  db: D1Database,
  opts: { limit: number; offset: number; order: 'asc' | 'desc' }
) {
  const countResult = await db.prepare('SELECT COUNT(*) as total FROM markets').first<{ total: number }>();
  const total = countResult?.total ?? 0;

  const { results: markets } = await db
    .prepare(
      `SELECT m.*, l.name as lga_name, l.slug as lga_slug, s.name as state_name, s.slug as state_slug
       FROM markets m
       JOIN lgas l ON m.lga_id = l.id
       JOIN states s ON l.state_id = s.id
       ORDER BY m.name ${opts.order === 'desc' ? 'DESC' : 'ASC'}
       LIMIT ? OFFSET ?`
    )
    .bind(opts.limit, opts.offset)
    .all();

  return { markets, total };
}

export async function searchMarkets(db: D1Database, query: string) {
  const pattern = `%${query}%`;

  const { results } = await db
    .prepare(
      `SELECT m.*, l.name as lga_name, l.slug as lga_slug, s.name as state_name, s.slug as state_slug
       FROM markets m
       JOIN lgas l ON m.lga_id = l.id
       JOIN states s ON l.state_id = s.id
       WHERE m.name LIKE ? OR l.name LIKE ? OR s.name LIKE ?
       ORDER BY m.name ASC
       LIMIT 50`
    )
    .bind(pattern, pattern, pattern)
    .all();

  return results;
}
