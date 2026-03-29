import { Hono } from 'hono';
import type { Bindings } from '../../types';

const app = new Hono<{ Bindings: Bindings }>();

app.post('/', async (c) => {
  const body = await c.req.json<{
    market_name: string;
    state: string;
    lga: string;
    lat?: number;
    lng?: number;
    description?: string;
    contributor_name?: string;
  }>();

  if (!body.market_name || !body.state || !body.lga) {
    return c.json(
      { success: false, error: { message: 'market_name, state, and lga are required', code: 'BAD_REQUEST' } },
      400
    );
  }

  const token = c.env.GITHUB_TOKEN;
  if (!token) {
    return c.json(
      { success: false, error: { message: 'Contribution service unavailable', code: 'SERVICE_UNAVAILABLE' } },
      503
    );
  }

  const contributor = body.contributor_name || 'Anonymous';
  const coords = body.lat && body.lng ? `${body.lat}, ${body.lng}` : 'Not provided';

  const issueBody = [
    `**Market Name:** ${body.market_name}`,
    `**State:** ${body.state}`,
    `**LGA:** ${body.lga}`,
    `**Coordinates:** ${coords}`,
    `**Description:** ${body.description || 'Not provided'}`,
    `**Submitted by:** ${contributor}`,
  ].join('\n');

  const response = await fetch('https://api.github.com/repos/ifihan/nigerian-markets-api/issues', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'iya-oloja',
    },
    body: JSON.stringify({
      title: `[Market Submission] ${body.market_name} — ${body.lga}, ${body.state}`,
      body: issueBody,
      labels: ['market-submission'],
    }),
  });

  if (!response.ok) {
    return c.json(
      { success: false, error: { message: 'Failed to create submission', code: 'UPSTREAM_ERROR' } },
      502
    );
  }

  const issue = await response.json<{ html_url: string }>();
  return c.json({ success: true, data: { issue_url: issue.html_url } }, 201);
});

export default app;
