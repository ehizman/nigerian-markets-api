import { join } from 'node:path';
import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: [join(process.cwd(), '..', 'openapi', 'openapi.yaml')],
});
