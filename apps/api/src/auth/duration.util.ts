const UNIT_TO_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/**
 * Converts a JWT-style duration ("1d", "12h", "30m", "3600s" or a raw number of
 * seconds) into milliseconds, so the cookie maxAge matches the token lifetime.
 * Falls back to 1 day on an unrecognised value.
 */
export function parseDurationToMs(value: string): number {
  const match = /^(\d+)\s*([smhd])?$/.exec(value.trim());
  if (!match) {
    return UNIT_TO_MS.d;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  // No unit → the value is a number of seconds (JWT convention).
  return amount * (unit ? UNIT_TO_MS[unit] : UNIT_TO_MS.s);
}
