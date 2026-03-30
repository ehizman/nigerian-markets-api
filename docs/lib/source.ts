import { loader, multiple } from 'fumadocs-core/source';
import { docs } from 'fumadocs-mdx:collections/server';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { openapi } from '@/lib/openapi';

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      baseDir: 'openapi',
    }),
  }),
  {
    baseUrl: '/docs',
    plugins: [openapiPlugin()],
  },
);
