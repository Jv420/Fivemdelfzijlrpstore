import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getPool } from '@/lib/mysql';
import { logger } from '@/lib/logger';

const allowedActions = new Set(['retry', 'delivered', 'failed']);

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.redirect(new URL('/admin/login', request.url), 303);
    }

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    const action = String(formData.get('action') || '');

    if (!Number.isInteger(id) || id <= 0 || !allowedActions.has(action)) {
      return NextResponse.redirect(new URL('/admin?error=invalid_action', request.url), 303);
    }

    const status = action === 'retry' ? 'pending' : action;
    const deliveryError = action === 'failed' ? 'Handmatig gemarkeerd als failed door admin' : null;
    const deliveredAt = action === 'delivered' ? new Date() : null;
    const pool = getPool();

    await pool.execute(
      `update pending_orders
       set status = :status,
           delivery_error = :delivery_error,
           delivered_at = :delivered_at
       where id = :id`,
      {
        id,
        status,
        delivery_error: deliveryError,
        delivered_at: deliveredAt,
      }
    );

    logger.info('Admin changed order status', { id, action, status });
    return NextResponse.redirect(new URL('/admin?updated=1', request.url), 303);
  } catch (error) {
    logger.error('Admin order action failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.redirect(new URL('/admin?error=action_failed', request.url), 303);
  }
}
