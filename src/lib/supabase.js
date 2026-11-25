import { createClient } from '@supabase/supabase-js';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';

function normalizeSupabaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  return rawUrl
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function normalizeCategory(rawCategory = '') {
  const value = String(rawCategory).trim().toLowerCase();
  if (value.includes('oil')) return 'Oils';
  if (value.includes('spice') || value.includes('masala') || value.includes('powder')) {
    return 'Spice Powders';
  }
  if (value.includes('dry') || value.includes('nut') || value.includes('fruit')) {
    return 'Dry Fruits';
  }
  if (value.includes('stationery') || value.includes('school') || value.includes('book')) {
    return 'Stationery';
  }
  return rawCategory.trim() || 'Oils';
}

function normalizeProduct(row, index) {
  return {
    id: row.id ?? `supa-${index}`,
    name: row.name || row.title || 'Organic Product',
    category: normalizeCategory(row.category),
    pack_size: row.pack_size || row.variant || row.unit || 'Standard Pack',
    price: Number(row.price ?? row.price_inr ?? 0),
    tag: row.tag || row.badge || '',
    description: row.description || '',
    image_url: row.image_url || '',
    in_stock: row.in_stock ?? true,
  };
}

/**
 * Fetch in-stock products from Supabase ordered by category and created_at.
 * Falls back gracefully to curated sample products if env vars are missing,
 * the table has no rows yet, or the request fails.
 */
export async function fetchProducts() {
  if (!supabase) {
    return { products: SAMPLE_PRODUCTS, source: 'sample' };
  }

  try {
    let { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('category', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      // Retry without created_at in case the table schema omits created_at
      const fallbackQuery = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('category', { ascending: true });

      data = fallbackQuery.data;
      error = fallbackQuery.error;
    }

    if (error || !Array.isArray(data) || data.length === 0) {
      return {
        products: SAMPLE_PRODUCTS,
        source: 'sample',
        note: error ? error.message : 'No in-stock products found in Supabase yet.',
      };
    }

    return {
      products: data.map(normalizeProduct),
      source: 'supabase',
    };
  } catch (err) {
    return {
      products: SAMPLE_PRODUCTS,
      source: 'sample',
      note: err instanceof Error ? err.message : 'Unable to reach Supabase.',
    };
  }
}

/**
 * Log a customer WhatsApp order / inquiry in the Supabase `inquiries` table.
 * Never throws so the WhatsApp handoff remains uninterrupted.
 */
export async function submitInquiry({ customer_name, phone, items_summary, notes }) {
  if (!supabase) {
    return { saved: false, reason: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.from('inquiries').insert([
      {
        customer_name,
        phone,
        items_summary,
        notes,
      },
    ]);

    if (error) {
      return { saved: false, reason: error.message };
    }

    return { saved: true };
  } catch (err) {
    return {
      saved: false,
      reason: err instanceof Error ? err.message : 'Network error',
    };
  }
}
