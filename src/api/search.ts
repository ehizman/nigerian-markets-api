import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { searchMarkets } from '../../lib/db';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const q = c.req.query('q');

  if (!q || q.trim().length === 0) {
    return c.json({ success: false, error: { message: 'Query parameter "q" is required', code: 'BAD_REQUEST' } }, 400);
  }

  if (q.length > 100) {
    return c.json({ success: false, error: { message: 'Query too long', code: 'BAD_REQUEST' } }, 400);
  }

  const results = await searchMarkets(c.env.DB, q.trim());
  return c.json({ success: true, data: results });
});

export default app;
