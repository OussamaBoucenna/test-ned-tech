import { CookieOptions } from 'express';

/** Name of the httpOnly cookie carrying the JWT. */
export const AUTH_COOKIE = 'access_token';

/**
 * Cookie options for the auth token.
 * - httpOnly: not readable by JS → immune to token theft via XSS.
 * - sameSite 'strict': blocks CSRF (front and API are same-site in dev).
 * - secure in production: only sent over HTTPS.
 */
export function authCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeMs,
  };
}
