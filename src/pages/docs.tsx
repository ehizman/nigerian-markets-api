import type { FC } from 'hono/jsx';

export const DocsPage: FC = () => {
  return (
    <div class="docs">
      <h1>API Documentation</h1>
      <p>All endpoints return JSON. No authentication required. Base URL: <code>/api</code></p>

      <section class="endpoint">
        <h2>List States</h2>
        <div class="code-block"><code>GET /api/states</code></div>
        <p>Returns all 36 states + FCT.</p>
        <details>
          <summary>Example response</summary>
          <pre>{`{
  "success": true,
  "data": [
    { "id": 1, "name": "Abia", "slug": "abia" },
    { "id": 2, "name": "Adamawa", "slug": "adamawa" },
    ...
  ]
}`}</pre>
        </details>
      </section>

      <section class="endpoint">
        <h2>Get State</h2>
        <div class="code-block"><code>GET /api/states/:slug</code></div>
        <p>Returns a state and its LGAs.</p>
        <details>
          <summary>Example response</summary>
          <pre>{`{
  "success": true,
  "data": {
    "id": 25, "name": "Lagos", "slug": "lagos",
    "lgas": [
      { "id": 100, "name": "Eti-Osa", "slug": "eti-osa" },
      ...
    ]
  }
}`}</pre>
        </details>
      </section>

      <section class="endpoint">
        <h2>Get LGA</h2>
        <div class="code-block"><code>GET /api/lgas/:slug</code></div>
        <p>Returns an LGA with its parent state and all markets.</p>
        <details>
          <summary>Example response</summary>
          <pre>{`{
  "success": true,
  "data": {
    "id": 100, "name": "Eti-Osa", "slug": "eti-osa",
    "state": { "id": 25, "name": "Lagos", "slug": "lagos" },
    "markets": [
      { "id": 1, "name": "Lekki Market", "slug": "lekki-market", "lat": 6.47, "lng": 3.59, "added_by": "ifihan" }
    ]
  }
}`}</pre>
        </details>
      </section>

      <section class="endpoint">
        <h2>List Markets</h2>
        <div class="code-block"><code>GET /api/markets?limit=20&amp;offset=0&amp;order=asc</code></div>
        <p>Paginated list of all markets. Max <code>limit</code> is 100.</p>
        <table>
          <thead><tr><th>Param</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>limit</code></td><td>20</td><td>Number of results (1–100)</td></tr>
            <tr><td><code>offset</code></td><td>0</td><td>Skip N results</td></tr>
            <tr><td><code>order</code></td><td>asc</td><td><code>asc</code> or <code>desc</code> by name</td></tr>
          </tbody>
        </table>
      </section>

      <section class="endpoint">
        <h2>Search Markets</h2>
        <div class="code-block"><code>GET /api/search?q=balogun</code></div>
        <p>Searches market names, LGA names, and state names. Returns up to 50 results.</p>
      </section>

      <section class="endpoint">
        <h2>Submit a Market</h2>
        <div class="code-block"><code>POST /api/contribute</code></div>
        <p>Creates a GitHub issue for review. Body (JSON):</p>
        <pre>{`{
  "market_name": "Balogun Market",
  "state": "Lagos",
  "lga": "Lagos Island",
  "lat": 6.4541,
  "lng": 3.3947,
  "description": "One of the largest markets in Lagos",
  "contributor_name": "your-github-username"
}`}</pre>
      </section>
    </div>
  );
};
