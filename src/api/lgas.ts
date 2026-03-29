import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { getLGABySlug } from '../../lib/db';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/:lga', async (c) => {
  const slug = c.req.param('lga');
  const lga = await getLGABySlug(c.env.DB, slug);

  if (!lga) {
    return c.json({ success: false, error: { message: 'LGA not found', code: 'NOT_FOUND' } }, 404);
  }

  return c.json({ success: true, data: lga });
});

export default app;
