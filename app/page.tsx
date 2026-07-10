import { products } from '@/lib/products';

export default function HomePage() {
  return (
    <main className="wrap">
      <section className="hero">
        <span className="badge">Officiële Delfzijl RP Supporter Webshop</span>
        <h1 className="title">Support Delfzijl RP</h1>
        <p className="muted">Koop veilige supporter perks via Stripe iDEAL of card. Rewards worden automatisch klaargezet voor delivery in-game.</p>
        <div className="notice">Deze store is ingericht voor supporter ranks en cosmetische voordelen. Direct geld, zwart geld en wapens worden bewust niet als standaardproducten aangeboden.</div>
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
