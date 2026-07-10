import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { getRequiredEnv } from '@/lib/env';

const COOKIE_NAME = 'hextactics_admin';

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function createAdminSessionToken() {
  return digest(`hextactics:${getRequiredEnv('ADMIN_PASSWORD')}`);
}

export function verifyAdminPassword(password: string) {
  const expected = Buffer.from(digest(getRequiredEnv('ADMIN_PASSWORD')));
  const provided = Buffer.from(digest(password));
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(value && value === createAdminSessionToken());
}

export const adminCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  },
};
