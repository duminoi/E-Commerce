import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  /**
   * OAuth 2.0 client ID from Google Cloud Console.
   * Create one at https://console.cloud.google.com/apis/credentials
   * and add http://localhost:5173 (and your production origin) to
   * the "Authorized JavaScript origins" list.
   */
  clientId: process.env.GOOGLE_CLIENT_ID || '',
}));
