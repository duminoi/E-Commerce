/**
 * Centralised env access. Anything that needs a build-time public variable
 * goes through this module so the rest of the app never touches `import.meta.env`
 * directly — that makes it easy to mock in tests and to fail loudly if a
 * variable is missing.
 */

export const env = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
};

export const isGoogleLoginConfigured = (): boolean => {
  const id = env.googleClientId;
  return !!id && id.length > 0;
};
