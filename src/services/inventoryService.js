import { supabase } from '../supabase/client';

export const getInventoryLogs = async (productId) => {
  const { data, error } = await supabase.from('inventory_logs').select('*').eq('product_id', productId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
