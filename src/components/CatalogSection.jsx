import { Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../data/sampleProducts';

const CATEGORY_ACCENTS = {
  Oils: { bg: 'badge-oil', icon: '🫙' },
  'Spice Powders': { bg: 'badge-spice', icon: '🌶️' },
  'Dry Fruits': { bg: 'badge-dry', icon: '🥜' },
  Stationery: { bg: 'badge-stationery', icon: '📓' },
};

export function CatalogSection({
  products,
  loading,
  catalogSource,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  bagQuantities,
  onAddToBag,
  onUpdateQty,
}) {
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    if (!matchesCategory) return false;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.pack_size.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.tag && item.tag.toLowerCase().includes(q))
    );
  });

  return (
    <section id="catalog" className="catalog-section" aria-labelledby="catalog-heading">
      <div className="container">
        <div className="catalog-header">
          <div>
            <h2 id="catalog-heading" className="section-title">
              Store Catalog
            </h2>
            <p className="section-subtitle">
              Select items and pack sizes to build your WhatsApp order bag for fast pickup or Vijayawada delivery.
            </p>
          </div>
          <div className="catalog-status-wrap">
            <span className="status-pill">
              <Sparkles size={13} aria-hidden="true" />
              {catalogSource === 'supabase' ? 'Live Store Inventory' : 'Featured Store Catalog'}
            </span>
          </div>
        </div>

        <div className="catalog-controls">
          <div className="category-tabs" role="tablist" aria-label="Product categories">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`category-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectCategory(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="search-field">
            <Search size={17} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search oils, 5L, 15L, chilli, notebooks..."
              aria-label="Search products"
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="search-clear"
                aria-label="Clear search"
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="product-grid" aria-busy="true" aria-label="Loading catalog">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="product-card skeleton-card">
                <div className="skeleton-line short" />
                <div className="skeleton-line title" />
                <div className="skeleton-line" />
                <div className="skeleton-line footer" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No matching items found</p>
            <p className="empty-text">
              Try another keyword or clear your filter to browse all oils, spice powders, dry fruits, and stationery.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const qty = bagQuantities[product.id] || 0;
              const accent = CATEGORY_ACCENTS[product.category] || {
                bg: 'badge-oil',
                icon: '🌿',
              };

              return (
                <article key={product.id} className="product-card">
                  <div className="product-card-top">
                    <div className="product-badges">
                      <span className={`pack-badge ${accent.bg}`}>
                        <span aria-hidden="true">{accent.icon}</span>
                        <span>{product.pack_size}</span>
                      </span>
                      {product.tag && <span className="tag-badge">{product.tag}</span>}
                    </div>

                    <span className="category-label">{product.category}</span>
                    <h3 className="product-title">{product.name}</h3>

                    {product.description && (
                      <p className="product-desc">{product.description}</p>
                    )}
                  </div>

                  <div className="product-card-bottom">
                    <div className="price-block">
                      <span className="price-value">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                      <span className="price-unit">/ {product.pack_size}</span>
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => onAddToBag(product)}
                      >
                        <ShoppingBag size={16} aria-hidden="true" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="qty-stepper" aria-label={`Quantity for ${product.name}`}>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(product.id, qty - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus size={15} aria-hidden="true" />
                        </button>
                        <span className="qty-count">{qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(product.id, qty + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus size={15} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
