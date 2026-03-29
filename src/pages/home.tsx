import type { FC } from 'hono/jsx';

export const HomePage: FC = () => {
  return (
    <div class="hero">
      <h1>Iya Oloja</h1>
      <p class="subtitle">An open directory and API for markets across all 36 states of Nigeria + FCT</p>

      <div class="features">
        <div class="feature">
          <h3>Free API</h3>
          <p>Search markets, browse by state or LGA. JSON responses, no auth required.</p>
        </div>
        <div class="feature">
          <h3>Community Driven</h3>
          <p>Anyone can contribute market data via GitHub PRs or our submission form.</p>
        </div>
        <div class="feature">
          <h3>Open Data</h3>
          <p>All market data is stored as JSON in the repo — transparent and version-controlled.</p>
        </div>
      </div>

      <div class="quick-start">
        <h2>Quick Start</h2>
        <div class="terminal">
          <div class="terminal-header">
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line"><span class="terminal-prompt">$</span> curl /api/markets?limit=10</div>
            <div class="terminal-line"><span class="terminal-prompt">$</span> curl /api/states/lagos</div>
            <div class="terminal-line"><span class="terminal-prompt">$</span> curl /api/search?q=balogun</div>
          </div>
        </div>
        <div class="quick-start-actions">
          <a href="/docs" class="btn btn-sm">View API Docs</a>
          <a href="/contribute" class="btn btn-sm btn-outline">Add a Market</a>
        </div>
      </div>
    </div>
  );
};
