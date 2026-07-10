export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="wrap admin-shell">
      <section className="card admin-login">
        <span className="badge">HexTactics Store Bridge Pro</span>
        <h1>Admin login</h1>
        <p className="muted">Log in om bestellingen en delivery-statussen te beheren.</p>
        {params.error && <div className="notice danger">Onjuist adminwachtwoord.</div>}
        <form action="/api/admin/login" method="POST">
          <label>
            Adminwachtwoord
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="btn" type="submit">Inloggen</button>
        </form>
      </section>
    </main>
  );
}
