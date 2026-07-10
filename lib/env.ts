const requiredServerEnv = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'FIVEM_BRIDGE_SECRET',
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_DATABASE',
] as const;

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function validateServerEnv() {
  const missing = requiredServerEnv.filter((key) => !process.env[key] || process.env[key]?.trim() === '');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
