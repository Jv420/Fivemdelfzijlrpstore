import { products } from '@/lib/products';

const productIcons: Record<string, string> = {
  rank: '★',
  priority: '⚡',
  vehicle_cosmetic: '◆',
  discord_role: '●',
};

export default function HomePage() {
  return (
    <main>
      <section className="store-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="wrap hero-inner">
          <nav className="store-nav">
            <div className="brand-mark">
              <span className="brand-logo">DRP</span>
              <div>
                <strong>Delfzijl RP</strong>
                <small>Officiële webshop</small>
              </div>
            </div>
            <a className="nav-link" href="#producten">Bekijk producten</a>
          </nav>

          <div className="hero-copy">
            <span className="badge">Veilig betalen met iDEAL & creditcard</span>
            <h1 className="title">Steun Delfzijl RP.<br /><span>Maak jouw ervaring compleet.</span></h1>
            <p className="hero-text">Ontdek exclusieve supportervoordelen, ranks en cosmetische uitbreidingen. Na betaling wordt je aankoop automatisch klaargezet voor levering in-game.</p>

            <div className="hero-actions">
              <a className="primary-link" href="#producten">Shop nu</a>
              <div className="trust-line"><span>✓</span> Automatische delivery <span>✓</span> Beveiligde checkout</div>
            </div>
          </div>

          <div className="benefit-grid">
            <article><span>01</span><strong>Direct geregeld</strong><p>Bestellingen worden automatisch verwerkt.</p></article>
            <article><span>02</span><strong>Veilig betalen</strong><p>Checkout via Stripe, iDEAL en creditcard.</p></article>
            <article><span>03</span><strong>Eigen community</strong><p>Jouw aankoop ondersteunt verdere ontwikkeling.</p></article>
          </div>
        </div>
      </section>

      <section id="producten" className="wrap product-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Onze webshop</span>
            <h2>Kies jouw voordeel</h2>
          </div>
          <p>Vul je FiveM license en spelernaam in. Daarna word je veilig doorgestuurd naar Stripe.</p>
        </div>

        <div className="grid product-grid">
          {products.map((product, index) => (
            <form key={product.id} className="card product-card" action="/api/checkout" method="POST">
              <div className="product-topline">
                <span className="product-icon">{productIcons[product.deliveryType] || '◆'}</span>
                {index === 0 && <span className="popular-pill">Populair</span>}
              </div>

              <div>
                <h3>{product.name}</h3>
                <p className="muted product-description">{product.description}</p>
              </div>

              <div className="price-row">
                <div className="price">€{(product.priceCents / 100).toFixed(2)}</div>
                <span>eenmalig</span>
              </div>

              <input type="hidden" name="productId" value={product.id} />

              <label className="field-label">
                FiveM license identifier
                <input name="license" placeholder="license:123456789abcdef" required />
              </label>

              <label className="field-label">
                Spelernaam
                <input name="playerName" placeholder="Jouw RP-naam" required />
              </label>

              <button className="btn" type="submit">Veilig afrekenen</button>
              <small className="secure-note">Beveiligde betaling via Stripe</small>
            </form>
          ))}
        </div>
      </section>

      <section className="wrap closing-banner">
        <div>
          <span className="eyebrow">Bedankt voor je steun</span>
          <h2>Samen bouwen we Delfzijl RP verder uit.</h2>
        </div>
        <div className="footer-brand">A HexTactics Project</div>
      </section>
    </main>
  );
}
