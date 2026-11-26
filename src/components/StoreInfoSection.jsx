import { Clock, ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=RJ+Organics+and+Oils+Polyclinic+Rd+opp+Style+union+Acharya+Ranga+Nagar+Vijayawada+Andhra+Pradesh+520010';

export function StoreInfoSection() {
  return (
    <section id="store-info" className="store-section" aria-labelledby="store-heading">
      <div className="container store-grid">
        <div className="store-details">
          <span className="section-eyebrow">Visit Our Neighbourhood Store</span>
          <h2 id="store-heading" className="section-title">
            RJ Organics and Oils — Vijayawada
          </h2>
          <p className="store-intro">
            Drop by our Vijayawada outlet opp. Style union to taste freshly pressed oils, pick up stone-ground spices and dry fruits, or grab everyday school stationery.
          </p>

          <dl className="store-info-list">
            <div className="info-item">
              <dt>
                <MapPin size={18} aria-hidden="true" />
                <span>Store Address</span>
              </dt>
              <dd>
                Polyclinic Rd, opp. Style union,
                <br />
                Acharya Ranga Nagar, Vijayawada,
                <br />
                Andhra Pradesh 520010
              </dd>
            </div>

            <div className="info-item">
              <dt>
                <Clock size={18} aria-hidden="true" />
                <span>Opening Hours</span>
              </dt>
              <dd>Open Daily: 10:00 AM – 9:30 PM (Monday – Sunday)</dd>
            </div>

            <div className="info-item">
              <dt>
                <Phone size={18} aria-hidden="true" />
                <span>Phone &amp; WhatsApp</span>
              </dt>
              <dd>
                <a href="tel:+919177212103" className="inline-link">
                  091772 12103
                </a>
              </dd>
            </div>
          </dl>

          <div className="store-cta-row">
            <a href="tel:+919177212103" className="btn-primary">
              <Phone size={17} aria-hidden="true" />
              <span>Call 091772 12103</span>
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MapPin size={17} aria-hidden="true" />
              <span>Open in Google Maps</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>

            <a
              href="https://wa.me/919177212103"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-outline"
            >
              <MessageCircle size={17} aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="store-landmark-card">
          <div className="landmark-pin" aria-hidden="true">
            <MapPin size={26} />
          </div>
          <h3>Easy Landmark Directions</h3>
          <p className="landmark-lead">
            Located directly <strong>opp. Style union</strong> in Acharya Ranga Nagar, Vijayawada.
          </p>
          <ul className="landmark-bullets">
            <li>Convenient two-wheeler &amp; car stopover opp. Style union</li>
            <li>Same-day WhatsApp bag preparation for quick pickup</li>
            <li>Bulk 5L Cans &amp; 15L Tins available for home &amp; function orders</li>
          </ul>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="landmark-map-btn"
          >
            Get Directions on Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}
