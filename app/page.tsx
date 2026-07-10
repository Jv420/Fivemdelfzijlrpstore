import { products } from '@/lib/products';

export default function HomePage() {
  return (
    <main className="wrap">
      <section className="hero">
        <span className="badge">Officiële Delfzijl RP Webshop</span>
        <h1 className="title">Steun Delfzijl RP</h1>
        <p className="muted">Steun de verdere ontwikkeling van Delfzijl RP en ontvang exclusieve supportervoordelen. Betalingen worden veilig verwerkt via Stripe met iDEAL en creditcard.</p>
        <div className="notice">Na een succesvolle betaling wordt je bestelling automatisch gekoppeld aan je FiveM-account en klaargezet voor levering in-game. Bedankt voor jouw steun aan de Delfzijl RP-community.</div>
      </section>

      <section className="grid">
        {products.map((product) => (
          <form key={product.id} className="card" action="/api/checkout" method="POST">
            <h2>{product.name}</h2>
            <p className="muted">{product.description}</p>
            <div className="price">€{(product.priceCents / 100).toFixed(2)}</div>
            <input type="hidden" name="productId" value={product.id} />
            <label>
              FiveM license identifier
              <input name="license" placeholder="Bijv. 123456789abcdef" required />
            </label>
            <label>
              Spelernaam
              <input name="playerName" placeholder="Je RP/spelernaam" required />
            </label>
            <button className="btn" type="submit">Afrekenen met Stripe</button>
          </form>
        ))}
      </section>
    </main>
  );
}
