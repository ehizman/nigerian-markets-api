import { createAPIPage } from 'fumadocs-openapi/ui';
import { openapi } from '@/lib/openapi';
import client from '@/components/api-page.client';

export const APIPage = createAPIPage(openapi, {
  client,
});
