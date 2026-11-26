import { MapPin, Phone, ShoppingBag } from 'lucide-react';

export function Header({ itemCount, totalAmount, onOpenBag }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand-lockup" aria-label="RJ Organics and Oils Home">
          <span className="brand-emblem" aria-hidden="true">
            RJ
          </span>
          <span className="brand-text">
            <span className="brand-name">RJ Organics &amp; Oils</span>
            <span className="brand-sub">
              <MapPin size={12} aria-hidden="true" />
              Gayatri Nagar, Vijayawada
            </span>
          </span>
        </a>

        <div className="header-actions">
          <a
            href="tel:+919177212103"
            className="btn-ghost hide-xs"
            aria-label="Call store at 091772 12103"
          >
            <Phone size={16} aria-hidden="true" />
            <span>091772 12103</span>
          </a>

          <button
            type="button"
            className="btn-bag"
            onClick={onOpenBag}
            aria-label={`Open Order Bag (${itemCount} items, ₹${totalAmount.toLocaleString('en-IN')})`}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Bag</span>
            {itemCount > 0 ? (
              <span className="bag-pill">
                {itemCount} · ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="bag-pill bag-pill-empty">0</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
