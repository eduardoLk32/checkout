import { env } from '@/env.mjs';

export const primepagConfig = {
  api_url: env.NEXT_PRIMEPAG_API_URL,
  client_id: env.NEXT_PRIMEPAG_CLIENT_ID,
  client_secret: env.NEXT_PRIMEPAG_CLIENT_SECRET,
};
