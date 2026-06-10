import { supabase } from '../supabase/client';
import { getProductsData } from '../utils/productsData';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseUrl !== '' && supabaseAnonKey && supabaseAnonKey !== '');
};

// Convert fallback data to match Supabase schema
const convertFallbackToSupabaseFormat = (fallbackProduct, division = 'building_materials') => {
  return {
    id: fallbackProduct.id,
    name_en: fallbackProduct.name,
    name_hi: fallbackProduct.name,
    description_en: fallbackProduct.desc,
    description_hi: fallbackProduct.desc,
    division: division,
    product_type: 'sale',
    price_min: fallbackProduct.priceMin,
    price_max: fallbackProduct.priceMax,
    price_unit: fallbackProduct.priceUnit,
    rent_price_per_day: null,
    stock_quantity: 100,
    min_stock_alert: 10,
    images: [fallbackProduct.image],
    specifications: null,
    tags: [fallbackProduct.tag],
    is_active: true,
    is_featured: fallbackProduct.tag === 'Bestseller',
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const getAllProducts = async (filters = {}) => {
  if (!isSupabaseConfigured()) {
    return getProductsData('en').map(p => convertFallbackToSupabaseFormat(p, filters.division));
  }
  // Select without category join — category_id can be null for many products
  let query = supabase.from('products').select('*');

  if (filters.division) query = query.eq('division', filters.division);
  if (filters.category_id) query = query.eq('category_id', filters.category_id);
  if (filters.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  } else {
    // By default only show active products
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    return getProductsData('en').map(p => convertFallbackToSupabaseFormat(p, filters.division));
  }
  return data || [];
};

export const getProductById = async (id) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(name_en, name_hi)`)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const getFeaturedProducts = async () => {
  if (!isSupabaseConfigured()) {
    return getProductsData('en')
      .filter(p => p.tag === 'Bestseller')
      .map(p => convertFallbackToSupabaseFormat(p));
  }
  const { data, error } = await supabase
    .from('products')
    .select(`*`)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(10);
  if (error) {
    return getProductsData('en')
      .filter(p => p.tag === 'Bestseller')
      .map(p => convertFallbackToSupabaseFormat(p));
  }
  return data;
};

export const getProductsByDivision = async (division) => {
  if (!isSupabaseConfigured()) {
    return getProductsData('en').map(p => convertFallbackToSupabaseFormat(p, division));
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('division', division)
    .eq('is_active', true);
  if (error) {
    return getProductsData('en').map(p => convertFallbackToSupabaseFormat(p, division));
  }
  return data || [];
};

export const searchProducts = async (searchQuery) => {
  if (!searchQuery) return [];
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('products')
    .select(`*`)
    .eq('is_active', true)
    .or(`name_en.ilike.%${searchQuery}%,name_hi.ilike.%${searchQuery}%,description_en.ilike.%${searchQuery}%`);
  if (error) throw error;
  return data;
};

export const createProduct = async (productData) => {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id, productData) => {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id) => {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
  // Soft delete
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const updateStock = async (id, quantityChange, reason, adminId) => {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
  // Start a transaction-like flow
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('id', id)
    .single();
    
  if (fetchError) throw fetchError;
  
  const newQuantity = product.stock_quantity + quantityChange;
  
  const { error: updateError } = await supabase
    .from('products')
    .update({ stock_quantity: newQuantity })
    .eq('id', id);
    
  if (updateError) throw updateError;
  
  // Log it
  await supabase.from('inventory_logs').insert([{
    product_id: id,
    action: quantityChange > 0 ? 'add' : 'remove',
    quantity_change: quantityChange,
    previous_quantity: product.stock_quantity,
    new_quantity: newQuantity,
    reason,
    admin_id: adminId
  }]);
  
  return newQuantity;
};

export const getLowStockProducts = async () => {
  if (!isSupabaseConfigured()) return [];
  // Using postgres function or simple query
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .filter('stock_quantity', 'lte', 'min_stock_alert'); // Works via eq if custom, else need rpc.
    // Actually direct column to column comparison is tricky in REST, so we can fetch all and filter in JS or use an RPC.
    // Let's fetch and filter for simplicity if dataset is small, or use RPC for large datasets.
    
  if (error) throw error;
  return data.filter(p => p.stock_quantity <= p.min_stock_alert);
};
