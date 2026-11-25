import { Clock, MapPin, MessageCircle, Sparkles, Truck } from 'lucide-react';

export function GrandOpeningBanner({ onBrowseClick }) {
  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-ribbon">
        <div className="container ribbon-inner">
          <Sparkles size={15} aria-hidden="true" />
          <span>
            <strong>Grand Opening</strong> — Now Serving Acharya Ranga Nagar, Polyclinic Rd &amp; Nearby Vijayawada
          </span>
        </div>
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span>Cold-Pressed Purity · Neighbourhood Convenience</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            Wood-Pressed Oils, Village Spices &amp; Daily School Essentials
          </h1>

          <p className="hero-lead">
            From 1L bottles to 15L family tins of pure Groundnut, Sesame &amp; Coconut oil—plus stone-ground Andhra spice powders, coastal dry fruits, and everyday school stationery right opposite <strong>Bhashyam Public School</strong>.
          </p>

          <div className="hero-cta-row">
            <a
              href="#catalog"
              onClick={onBrowseClick}
              className="btn-primary"
            >
              Browse Store Catalog
            </a>
            <a
              href="https://wa.me/919177212103?text=Namaste%20RJ%20Organics%20%26%20Oils!%20I%20would%20like%20to%20enquire%20about%20today%27s%20stock."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span>WhatsApp Store</span>
            </a>
          </div>

          <dl className="hero-meta-strip">
            <div className="meta-chip">
              <dt>
                <Clock size={15} aria-hidden="true" />
                <span>Open Daily</span>
              </dt>
              <dd>10:00 AM – 9:30 PM</dd>
            </div>
            <div className="meta-chip">
              <dt>
                <MapPin size={15} aria-hidden="true" />
                <span>Landmark</span>
              </dt>
              <dd>Opp. Bhashyam Public School</dd>
            </div>
            <div className="meta-chip">
              <dt>
                <Truck size={15} aria-hidden="true" />
                <span>Quick Order</span>
              </dt>
              <dd>Pickup &amp; Local Delivery</dd>
            </div>
          </dl>
        </div>

        <aside className="hero-card" aria-label="Grand Opening Highlights">
          <div className="hero-card-badge">Grand Opening Special</div>
          <h2 className="hero-card-heading">Freshly Pressed &amp; Packed Every Week</h2>
          <ul className="hero-highlights">
            <li>
              <span className="dot-gold" aria-hidden="true" />
              <div>
                <strong>1L, 5L Cans &amp; 15L Tins</strong>
                <p>Groundnut, Black Sesame (Nuvvula) &amp; Virgin Coconut Oils</p>
              </div>
            </li>
            <li>
              <span className="dot-gold" aria-hidden="true" />
              <div>
                <strong>Andhra Spice Powders &amp; Dry Fruits</strong>
                <p>Guntur Chilli, Nizamabad Turmeric, Palasa Cashews &amp; Almonds</p>
              </div>
            </li>
            <li>
              <span className="dot-gold" aria-hidden="true" />
              <div>
                <strong>School Stationery Corner</strong>
                <p>Notebooks, geometry sets &amp; art kits on your school drop-off route</p>
              </div>
            </li>
          </ul>
          <a href="#store-info" className="hero-card-link">
            See Polyclinic Rd Directions →
          </a>
        </aside>
      </div>
    </section>
  );
}
