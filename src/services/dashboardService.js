import { supabase } from '../supabase/client';

export const getDashboardStats = async () => {
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: totalCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer');
  
  return {
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
  };
};
