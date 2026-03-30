import type { FC } from 'hono/jsx';

export const DocsPage: FC = () => {
  return (
    <div class="docs">
      <h1>Documentation</h1>
      <p>
        The public docs are being moved into a separate FumaDocs app so the API and the docs site can evolve
        independently without duplicating content in this project.
      </p>

      <section class="endpoint">
        <h2>Current status</h2>
        <p>
          Once the FumaDocs site is deployed, this route will automatically redirect there through the <code>DOCS_URL</code>{' '}
          environment variable.
        </p>
      </section>

      <section class="endpoint">
        <h2>Source of truth</h2>
        <ul>
          <li><a href="https://github.com/ifihan/nigerian-markets-api/tree/main/docs">FumaDocs app source</a></li>
          <li><a href="https://github.com/ifihan/nigerian-markets-api/blob/main/openapi/openapi.yaml">OpenAPI spec</a></li>
          <li><a href="/api">API index</a></li>
        </ul>
      </section>
    </div>
  );
};
