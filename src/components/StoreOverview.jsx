import { Clock, MapPin, MessageCircle, Truck } from 'lucide-react';

export function StoreOverview() {
  return (
    <section className="overview-section" aria-labelledby="overview-title">
      <div className="container overview-grid">
        <div className="overview-copy">
          <div className="overview-eyebrow">
            <span>Cold-Pressed Purity · Neighbourhood Convenience</span>
          </div>

          <h1 id="overview-title" className="overview-title">
            Wood-Pressed Oils, Village Spices &amp; Daily School Essentials
          </h1>

          <p className="overview-lead">
            From 1L bottles to 15L family tins of pure Groundnut, Sesame &amp; Coconut oil—plus stone-ground Andhra spice powders, coastal dry fruits, and everyday school stationery right <strong>opp. Style Union</strong>.
          </p>

          <div className="overview-cta-row">
            <a href="#catalog" className="btn-primary">
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

          <dl className="overview-meta-strip">
            <div className="meta-chip">
              <dt>
                <Clock size={15} aria-hidden="true" />
                <span>Open Daily</span>
              </dt>
              <dd>10:00 AM - 9:30 PM</dd>
            </div>
            <div className="meta-chip">
              <dt>
                <MapPin size={15} aria-hidden="true" />
                <span>Landmark</span>
              </dt>
              <dd>opp. Style Union</dd>
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

        <aside className="highlights-card" aria-label="Store Highlights">
          <div className="highlights-card-badge">Gayatri Nagar Store</div>
          <h2 className="highlights-card-heading">Freshly Pressed &amp; Packed Every Week</h2>
          <ul className="highlights-list">
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
                <p>Notebooks, geometry sets &amp; art kits for everyday student needs</p>
              </div>
            </li>
          </ul>
          <a href="#store-info" className="highlights-card-link">
            See Gayatri Nagar Directions →
          </a>
        </aside>
      </div>
    </section>
  );
}
