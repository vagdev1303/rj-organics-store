import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { submitInquiry } from '../lib/supabase';

const STORE_WHATSAPP_NUMBER = '919177212103';

export function OrderBagDrawer({
  isOpen,
  onClose,
  items,
  totalAmount,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
}) {
  const dialogRef = useRef(null);
  const [customerName, setCustomerName] = useState('');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedState, setSubmittedState] = useState(null);

  // Sync native <dialog> modal open/close state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Progressive enhancement fallback for light dismiss where `closedby` is unsupported
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    let pressedOutside = false;
    const onPointerDown = (e) => {
      pressedOutside = isOutside(e);
    };
    const onPointerUp = (e) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('pointerup', onPointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown);
      dialog.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  function handleDialogClose() {
    if (dialogRef.current) {
      dialogRef.current.returnValue = '';
    }
    setErrorMsg('');
    onClose();
  }

  function buildWhatsAppUrl(name, customerArea, customerPhone, customerNotes) {
    const itemLines = items.map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (${item.variant}) × ${item.qty} = ₹${(
          Number(item.price_inr) * item.qty
        ).toLocaleString('en-IN')}`
    );

    const messageLines = [
      '*New Order / Inquiry — RJ Organics & Oils*',
      'Store: opp. Style union, Acharya Ranga Nagar, Vijayawada',
      `Name: ${name}`,
      `Area / Apartment (Vijayawada): ${customerArea}`,
      customerPhone ? `Phone: ${customerPhone}` : null,
      '',
      '*Selected Items:*',
      ...itemLines,
      '',
      `*Estimated Total: ₹${totalAmount.toLocaleString('en-IN')}*`,
      customerNotes ? `Notes: ${customerNotes}` : null,
      '',
      'Please confirm availability & delivery/pickup timing.',
    ].filter((line) => line !== null);

    return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      messageLines.join('\n')
    )}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Please add at least one product to your bag first.');
      return;
    }

    const trimmedName = customerName.trim();
    const trimmedArea = area.trim();
    const trimmedPhone = phone.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedName || !trimmedArea) {
      setErrorMsg('Please enter your name and Vijayawada area / apartment.');
      return;
    }

    setSubmitting(true);

    const itemsSummary = items
      .map(
        (item) =>
          `${item.name} (${item.variant}) x${item.qty} - ₹${(
            Number(item.price_inr) * item.qty
          ).toLocaleString('en-IN')}`
      )
      .join('; ') + ` | Total: ₹${totalAmount.toLocaleString('en-IN')}`;

    const combinedNotes = [
      `Area/Apartment: ${trimmedArea}`,
      trimmedNotes ? `Notes: ${trimmedNotes}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const waUrl = buildWhatsAppUrl(
      trimmedName,
      trimmedArea,
      trimmedPhone,
      trimmedNotes
    );

    const dbResult = await submitInquiry({
      customer_name: trimmedName,
      phone: trimmedPhone || 'WhatsApp Inquiry',
      items_summary: itemsSummary,
      notes: combinedNotes,
    });

    setSubmitting(false);
    setSubmittedState({
      waUrl,
      savedToDb: dbResult.saved,
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="bag-dialog-title"
      className="bag-dialog"
      onClose={handleDialogClose}
    >
      <div className="bag-shell">
        <div className="bag-header">
          <div className="bag-title-group">
            <ShoppingBag size={20} aria-hidden="true" />
            <h1 id="bag-dialog-title" className="bag-title">
              Your Order Bag
            </h1>
          </div>
          <button
            type="button"
            className="bag-close-btn"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close Order Bag"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="bag-body">
          {items.length === 0 ? (
            <div className="bag-empty">
              <div className="bag-empty-icon" aria-hidden="true">
                <ShoppingBag size={30} />
              </div>
              <p className="bag-empty-title">Your order bag is empty</p>
              <p className="bag-empty-sub">
                Add cold-pressed oils, spice powders, dry fruits, or school stationery from the catalog to place a quick WhatsApp order.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => dialogRef.current?.close()}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="bag-items-header">
                <span>
                  {items.reduce((sum, i) => sum + i.qty, 0)} item(s) selected
                </span>
                <button
                  type="button"
                  className="btn-text-danger"
                  onClick={() => {
                    onClearBag();
                    setSubmittedState(null);
                  }}
                >
                  Clear Bag
                </button>
              </div>

              <ul className="bag-list">
                {items.map((item) => (
                  <li key={item.id} className="bag-item">
                    <div className="bag-item-info">
                      <span className="bag-item-name">{item.name}</span>
                      <span className="bag-item-meta">
                        {item.variant} · ₹{Number(item.price_inr).toLocaleString('en-IN')} each
                      </span>
                    </div>

                    <div className="bag-item-controls">
                      <div className="qty-stepper compact">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(item.id, item.qty - 1)}
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="qty-count">{item.qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>

                      <span className="bag-item-subtotal">
                        ₹{(Number(item.price_inr) * item.qty).toLocaleString('en-IN')}
                      </span>

                      <button
                        type="button"
                        className="btn-icon-remove"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bag-total-bar">
                <span>Estimated Total</span>
                <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>

              <form onSubmit={handleSubmit} className="bag-form" noValidate>
                <div className="form-field">
                  <label htmlFor="customer-name">
                    Customer Name <span className="req">*</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    autoFocus
                    autoComplete="name"
                    placeholder="e.g., Srinivas Rao"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="customer-area">
                    Area / Apartment in Vijayawada <span className="req">*</span>
                  </label>
                  <input
                    id="customer-area"
                    type="text"
                    required
                    placeholder="e.g., Acharya Ranga Nagar, Benz Circle, Patamata"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="customer-phone">Phone / WhatsApp (Optional)</label>
                    <input
                      id="customer-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="e.g., 98480 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="customer-notes">Delivery / Pickup Note</label>
                    <input
                      id="customer-notes"
                      type="text"
                      placeholder="e.g., Store pickup at 6 PM"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="form-error" role="alert">
                    {errorMsg}
                  </p>
                )}

                {submittedState && (
                  <div className="form-success" role="status">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <div>
                      <p>
                        Inquiry prepared
                        {submittedState.savedToDb ? ' & logged with the store' : ''}! If WhatsApp did not open automatically:
                      </p>
                      <a
                        href={submittedState.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wa-fallback-link"
                      >
                        <span>Open WhatsApp Chat Now</span>
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-whatsapp-submit"
                  disabled={submitting}
                >
                  <MessageCircle size={19} aria-hidden="true" />
                  <span>
                    {submitting
                      ? 'Preparing WhatsApp Order...'
                      : `Send Order on WhatsApp · ₹${totalAmount.toLocaleString('en-IN')}`}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
