import { useEffect, useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { fetchProducts } from './lib/supabase';
import { SAMPLE_PRODUCTS } from './data/sampleProducts';
import { Header } from './components/Header';
import { CatalogSection } from './components/CatalogSection';
import { OrderBagDrawer } from './components/OrderBagDrawer';
import { StoreInfoSection } from './components/StoreInfoSection';

export default function App() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [catalogSource, setCatalogSource] = useState('sample');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bagQuantities, setBagQuantities] = useState({});
  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchProducts().then((result) => {
      if (!active) return;
      setProducts(result.products);
      setCatalogSource(result.source);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const bagItems = useMemo(() => {
    return products
      .filter((product) => (bagQuantities[product.id] || 0) > 0)
      .map((product) => ({
        ...product,
        qty: bagQuantities[product.id],
      }));
  }, [products, bagQuantities]);

  const itemCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.qty, 0),
    [bagItems]
  );

  const totalAmount = useMemo(
    () => bagItems.reduce((sum, item) => sum + Number(item.price_inr) * item.qty, 0),
    [bagItems]
  );

  function handleAddToBag(product) {
    setBagQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  }

  function handleUpdateQty(productId, nextQty) {
    setBagQuantities((prev) => {
      const updated = { ...prev };
      if (nextQty <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = nextQty;
      }
      return updated;
    });
  }

  function handleRemoveItem(productId) {
    setBagQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  }

  function handleClearBag() {
    setBagQuantities({});
  }

  return (
    <div id="top" className="app-shell">
      <Header
        itemCount={itemCount}
        totalAmount={totalAmount}
        onOpenBag={() => setIsBagOpen(true)}
      />

      <main>
        <CatalogSection
          products={products}
          loading={loading}
          catalogSource={catalogSource}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          bagQuantities={bagQuantities}
          onAddToBag={handleAddToBag}
          onUpdateQty={handleUpdateQty}
        />

        <StoreInfoSection />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="footer-brand">
            <strong>RJ Organics and Oils</strong> · Pinnamaneni, Polyclinic Rd, opp. Style Union, beside Nalanda School Road, Gayatri Nagar, Vijayawada, Andhra Pradesh 520008
          </p>
          <p className="footer-hours">Open Daily 10:00 AM – 9:30 PM · Call / WhatsApp: 091772 12103</p>
        </div>
      </footer>

      {itemCount > 0 && (
        <div className="mobile-floating-bag">
          <button
            type="button"
            className="mobile-floating-bag-btn"
            onClick={() => setIsBagOpen(true)}
          >
            <span className="floating-left">
              <ShoppingBag size={18} aria-hidden="true" />
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} in bag</span>
            </span>
            <span className="floating-right">
              ₹{totalAmount.toLocaleString('en-IN')} · View Bag →
            </span>
          </button>
        </div>
      )}

      <OrderBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        totalAmount={totalAmount}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearBag={handleClearBag}
      />
    </div>
  );
}
