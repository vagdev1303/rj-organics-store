import { useMemo, useState } from 'react';
import { Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../data/sampleProducts';

const CATEGORY_ACCENTS = {
  Oils: { bg: 'badge-oil', icon: '🫙' },
  'Spice Powders': { bg: 'badge-spice', icon: '🌶️' },
  'Dry Fruits': { bg: 'badge-dry', icon: '🥜' },
  Stationery: { bg: 'badge-stationery', icon: '📓' },
};

function groupProductsByNameAndCategory(products) {
  const groupsMap = new Map();

  for (const row of products) {
    const cleanName = String(row.name || '').trim();
    const cleanCategory = String(row.category || '').trim();
    const groupKey = `${cleanCategory.toLowerCase()}::${cleanName.toLowerCase()}`;

    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, {
        key: groupKey,
        name: cleanName,
        category: cleanCategory,
        variants: [],
      });
    }

    groupsMap.get(groupKey).variants.push(row);
  }

  return Array.from(groupsMap.values()).map((group) => ({
    ...group,
    variants: [...group.variants].sort(
      (a, b) => Number(a.price_inr) - Number(b.price_inr)
    ),
  }));
}

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
  // Tracks selected variant row id per grouped product key
  const [selectedVariantByGroup, setSelectedVariantByGroup] = useState({});

  const groupedProducts = useMemo(
    () => groupProductsByNameAndCategory(products),
    [products]
  );

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return groupedProducts.filter((group) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        group.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (!q) return true;

      if (
        group.name.toLowerCase().includes(q) ||
        group.category.toLowerCase().includes(q)
      ) {
        return true;
      }

      return group.variants.some(
        (v) =>
          v.variant.toLowerCase().includes(q) ||
          (v.description && v.description.toLowerCase().includes(q)) ||
          (v.tag && v.tag.toLowerCase().includes(q))
      );
    });
  }, [groupedProducts, selectedCategory, searchQuery]);

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
        ) : filteredGroups.length === 0 ? (
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
            {filteredGroups.map((group) => {
              const selectedId = selectedVariantByGroup[group.key];
              const activeProduct =
                group.variants.find((v) => v.id === selectedId) ||
                group.variants[0];
              const hasMultipleVariants = group.variants.length > 1;
              const qty = bagQuantities[activeProduct.id] || 0;
              const accent = CATEGORY_ACCENTS[group.category] || {
                bg: 'badge-oil',
                icon: '🌿',
              };

              return (
                <article key={group.key} className="product-card">
                  <div className="product-card-top">
                    <div className="product-badges">
                      <span className={`pack-badge ${accent.bg}`}>
                        <span aria-hidden="true">{accent.icon}</span>
                        <span>{activeProduct.variant}</span>
                      </span>
                      {activeProduct.tag && (
                        <span className="tag-badge">{activeProduct.tag}</span>
                      )}
                    </div>

                    <span className="category-label">{group.category}</span>
                    <h3 className="product-title">{group.name}</h3>

                    {activeProduct.description && (
                      <p className="product-desc">{activeProduct.description}</p>
                    )}

                    {hasMultipleVariants && (
                      <div
                        className="variant-pills"
                        role="group"
                        aria-label={`Select pack size for ${group.name}`}
                      >
                        {group.variants.map((variantRow) => {
                          const isSelected = variantRow.id === activeProduct.id;
                          return (
                            <button
                              key={variantRow.id}
                              type="button"
                              aria-pressed={isSelected}
                              className={`variant-pill ${isSelected ? 'is-selected' : ''}`}
                              onClick={() =>
                                setSelectedVariantByGroup((prev) => ({
                                  ...prev,
                                  [group.key]: variantRow.id,
                                }))
                              }
                            >
                              {variantRow.variant}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="product-card-bottom">
                    <div className="price-block">
                      <span className="price-value">
                        ₹{Number(activeProduct.price_inr).toLocaleString('en-IN')}
                      </span>
                      <span className="price-unit">/ {activeProduct.variant}</span>
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => onAddToBag(activeProduct)}
                      >
                        <ShoppingBag size={16} aria-hidden="true" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div
                        className="qty-stepper"
                        aria-label={`Quantity for ${activeProduct.name} (${activeProduct.variant})`}
                      >
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(activeProduct.id, qty - 1)}
                          aria-label={`Decrease quantity of ${activeProduct.name} ${activeProduct.variant}`}
                        >
                          <Minus size={15} aria-hidden="true" />
                        </button>
                        <span className="qty-count">{qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(activeProduct.id, qty + 1)}
                          aria-label={`Increase quantity of ${activeProduct.name} ${activeProduct.variant}`}
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
