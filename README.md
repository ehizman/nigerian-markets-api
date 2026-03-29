# Iya Oloja — Nigerian Markets API

An open directory and free API for markets across all 36 states of Nigeria + FCT.

**Data is community-driven** — anyone can contribute market information via pull requests or the web form.

## API

Base URL: `https://iya-oloja.pages.dev/api` (or your deployed URL)

No authentication required. All responses are JSON.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/states` | List all states |
| GET | `/api/states/:slug` | Get a state and its LGAs |
| GET | `/api/lgas/:slug` | Get an LGA and its markets |
| GET | `/api/markets?limit=20&offset=0&order=asc` | Paginated list of markets |
| GET | `/api/search?q=balogun` | Search markets, LGAs, and states |
| POST | `/api/contribute` | Submit a market (creates a GitHub issue) |

### Example

```bash
curl https://iya-oloja.pages.dev/api/states/lagos
```

```json
{
  "success": true,
  "data": {
    "id": 25,
    "name": "Lagos",
    "slug": "lagos",
    "lgas": [
      { "id": 1, "name": "Eti-Osa", "slug": "lagos-eti-osa" },
      { "id": 2, "name": "Lagos Island", "slug": "lagos-lagos-island" }
    ]
  }
}
```

## Contributing Markets

### Option 1: Pull Request (preferred)

1. Fork this repository
2. Open the state file at `data/states/<state-slug>.json`
3. Find the correct LGA and add a market to its `markets` array:

```json
{
  "name": "Balogun Market",
  "slug": "balogun-market",
  "coordinates": { "lat": 6.4541, "lng": 3.3947 },
  "added_by": "your-github-username"
}
```

4. Submit a pull request — CI will validate your data automatically

**Slug format:** lowercase, hyphens only (e.g., `mile-12-market`). Must be unique across all markets.

**Coordinates:** Optional. Use Google Maps to find lat/lng for the market location.

### Option 2: Web Form

Visit the [contribute page](https://iya-oloja.pages.dev/contribute) to submit a market through the web form. This creates a GitHub issue that maintainers will review and add.

### Option 3: GitHub Issue

Use the [Add a Market](https://github.com/ifihan/nigerian-markets-api/issues/new?template=add-market.yml) issue template.

## Data Structure

All market data lives in `data/states/` as JSON files (one per state). This is the source of truth — changes here are synced to the database via CI.

```
data/states/
├── abia.json
├── adamawa.json
├── ...
├── lagos.json
└── zamfara.json
```

Each file follows this structure:

```json
{
  "name": "Lagos",
  "slug": "lagos",
  "lgas": [
    {
      "name": "Lagos Island",
      "slug": "lagos-lagos-island",
      "markets": [
        {
          "name": "Balogun Market",
          "slug": "balogun-market",
          "coordinates": { "lat": 6.4541, "lng": 3.3947 },
          "added_by": "ifihan"
        }
      ]
    }
  ]
}
```

## Development

```bash
npm install
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run deploy` | Build and deploy to Cloudflare Pages |
| `npm run seed` | Regenerate state JSON files (clears markets!) |
| `npm run validate` | Validate all data files |
| `npm run db:migrate` | Run D1 migrations locally |

### Tech Stack

- [Hono](https://hono.dev) — lightweight web framework
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting and edge compute
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — SQLite database at the edge
- [Vite](https://vitejs.dev) — build tool

### Setting up D1

```bash
# Create the database
wrangler d1 create iya-oloja

# Update wrangler.toml with the database_id from the output above

# Run migrations
wrangler d1 execute iya-oloja --local --file=migrations/0001_create_tables.sql

# For production
wrangler d1 execute iya-oloja --file=migrations/0001_create_tables.sql
```

### CI/CD

- **PRs touching `data/`** → `validate-data.yml` runs the validation script
- **Merges to `main` touching `data/`** → `sync-database.yml` syncs JSON to D1

Required GitHub secrets for sync: `CF_API_TOKEN`, `CF_ACCOUNT_ID`, `CF_DATABASE_ID`

## License

MIT
