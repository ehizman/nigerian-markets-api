import type { FC } from 'hono/jsx';

export const NotFoundPage: FC = () => {
  return (
    <div class="not-found">
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <a href="/" class="btn">Go Home</a>
    </div>
  );
};
