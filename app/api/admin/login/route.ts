import { NextResponse } from 'next/server';
import { adminCookie, createAdminSessionToken, verifyAdminPassword } from '@/lib/admin-auth';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get('password') || '');

  if (!verifyAdminPassword(password)) {
    logger.warn('Failed admin login attempt');
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url), 303);
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.cookies.set(adminCookie.name, createAdminSessionToken(), adminCookie.options);
  logger.info('Admin login succeeded');
  return response;
}
