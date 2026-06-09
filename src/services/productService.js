import { supabase } from '../supabase/client';

export const getAllProducts = async (filters = {}) => {
  let query = supabase.from('products').select(`*, category:categories(name_en, name_hi)`);

  if (filters.division) {
    query = query.eq('division', filters.division);
  }
  if (filters.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }
  
  const { data, error } = await query.order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(name_en, name_hi)`)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`*`)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(10);
  if (error) throw error;
  return data;
};

export const getProductsByDivision = async (division) => {
  const { data, error } = await supabase
    .from('products')
    .select(`*`)
    .eq('division', division)
    .eq('is_active', true);
  if (error) throw error;
  return data;
};

export const searchProducts = async (searchQuery) => {
  if (!searchQuery) return [];
  const { data, error } = await supabase
    .from('products')
    .select(`*`)
    .eq('is_active', true)
    .or(`name_en.ilike.%${searchQuery}%,name_hi.ilike.%${searchQuery}%,description_en.ilike.%${searchQuery}%`);
  if (error) throw error;
  return data;
};

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id, productData) => {
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
  // Soft delete
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const updateStock = async (id, quantityChange, reason, adminId) => {
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
