import { redirect } from 'next/navigation';
import type { RowDataPacket } from 'mysql2';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getPool } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

type OrderStatus = 'pending' | 'processing' | 'delivered' | 'failed';

type OrderRow = RowDataPacket & {
  id: number;
  stripe_session_id: string;
  product_id: string;
  product_name: string;
  player_license: string;
  player_name: string | null;
  status: OrderStatus;
  amount_total: number;
  currency: string;
  delivery_error: string | null;
  delivery_attempts: number;
  processing_at: Date | null;
  created_at: Date;
  delivered_at: Date | null;
};

type CountRow = RowDataPacket & {
  status: OrderStatus;
  total: number;
};

const allowedStatuses = new Set<OrderStatus>(['pending', 'processing', 'delivered', 'failed']);

function money(amount: number, currency: string) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; updated?: string; error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const requestedStatus = params.status as OrderStatus | undefined;
  const status = requestedStatus && allowedStatuses.has(requestedStatus) ? requestedStatus : undefined;
  const pool = getPool();

  const [countRows] = await pool.execute<CountRow[]>(
    `select status, count(*) as total
     from pending_orders
     group by status`
  );

  const [orders] = status
    ? await pool.execute<OrderRow[]>(
        `select id, stripe_session_id, product_id, product_name, player_license, player_name,
                status, amount_total, currency, delivery_error, delivery_attempts, processing_at,
                created_at, delivered_at
         from pending_orders
         where status = :status
         order by created_at desc
         limit 100`,
        { status }
      )
    : await pool.execute<OrderRow[]>(
        `select id, stripe_session_id, product_id, product_name, player_license, player_name,
                status, amount_total, currency, delivery_error, delivery_attempts, processing_at,
                created_at, delivered_at
         from pending_orders
         order by created_at desc
         limit 100`
      );

  const counts: Record<OrderStatus, number> = { pending: 0, processing: 0, delivered: 0, failed: 0 };
  for (const row of countRows) counts[row.status] = Number(row.total);
  const totalOrders = counts.pending + counts.processing + counts.delivered + counts.failed;

  return (
    <main className="wrap admin-shell">
      <header className="admin-header">
        <div>
          <span className="badge">HexTactics Store Bridge Pro</span>
          <h1>Order dashboard</h1>
          <p className="muted">Bekijk en beheer de laatste 100 bestellingen.</p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button className="btn secondary" type="submit">Uitloggen</button>
        </form>
      </header>

      {params.updated && <div className="notice success">Orderstatus is bijgewerkt.</div>}
      {params.error && <div className="notice danger">De actie kon niet worden uitgevoerd.</div>}

      <section className="stats-grid five-columns">
        <a className="stat-card" href="/admin?status=pending"><strong>{counts.pending}</strong><span>Pending</span></a>
        <a className="stat-card" href="/admin?status=processing"><strong>{counts.processing}</strong><span>Processing</span></a>
        <a className="stat-card" href="/admin?status=delivered"><strong>{counts.delivered}</strong><span>Delivered</span></a>
        <a className="stat-card" href="/admin?status=failed"><strong>{counts.failed}</strong><span>Failed</span></a>
        <a className="stat-card" href="/admin"><strong>{totalOrders}</strong><span>Alle orders</span></a>
      </section>

      <section className="card table-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Speler</th>
                <th>Bedrag</th>
                <th>Status</th>
                <th>Pogingen</th>
                <th>Aangemaakt</th>
                <th>Fout</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td><strong>{order.product_name}</strong><small>{order.product_id}</small></td>
                  <td><strong>{order.player_name || 'Onbekend'}</strong><small>{order.player_license}</small></td>
                  <td>{money(order.amount_total, order.currency)}</td>
                  <td><span className={`status-pill ${order.status}`}>{order.status}</span></td>
                  <td>{order.delivery_attempts}</td>
                  <td>{new Date(order.created_at).toLocaleString('nl-NL')}</td>
                  <td className="error-cell">{order.delivery_error || '—'}</td>
                  <td>
                    <div className="action-row">
                      {order.status !== 'pending' && (
                        <form action="/api/admin/orders" method="POST">
                          <input type="hidden" name="id" value={order.id} />
                          <input type="hidden" name="action" value="retry" />
                          <button className="mini-btn" type="submit">Retry</button>
                        </form>
                      )}
                      {order.status !== 'delivered' && (
                        <form action="/api/admin/orders" method="POST">
                          <input type="hidden" name="id" value={order.id} />
                          <input type="hidden" name="action" value="delivered" />
                          <button className="mini-btn" type="submit">Delivered</button>
                        </form>
                      )}
                      {order.status !== 'failed' && (
                        <form action="/api/admin/orders" method="POST">
                          <input type="hidden" name="id" value={order.id} />
                          <input type="hidden" name="action" value="failed" />
                          <button className="mini-btn danger-btn" type="submit">Failed</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={9} className="empty-state">Geen orders gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
