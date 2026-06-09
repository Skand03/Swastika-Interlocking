import { supabase } from '../supabase/client';

export const createOrder = async (orderData) => {
  // First, get the current year for the order number prefix
  const year = new Date().getFullYear();
  
  // We need to generate a sequential order number.
  // Easiest way in pure JS without an Edge Function is to fetch the latest order.
  // (In production, an Edge Function or DB sequence is safer against race conditions).
  const { data: lastOrder } = await supabase
    .from('orders')
    .select('order_number')
    .ilike('order_number', `SW-${year}-%`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  let nextNum = 1;
  if (lastOrder && lastOrder.order_number) {
    const parts = lastOrder.order_number.split('-');
    if (parts.length === 3) {
      nextNum = parseInt(parts[2], 10) + 1;
    }
  }
  
  const orderNumber = `SW-${year}-${String(nextNum).padStart(3, '0')}`;
  
  const finalOrderData = {
    ...orderData,
    order_number: orderNumber,
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert([finalOrderData])
    .select()
    .single();
    
  if (error) throw error;
  
  return data;
};

export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, customer:profiles(full_name, phone, email)`)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const getOrdersByCustomer = async (customerId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAllOrders = async (filters = {}) => {
  let query = supabase.from('orders').select('*');
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (id, status, adminNotes = null) => {
  const updates = { status };
  if (adminNotes !== null) updates.admin_notes = adminNotes;
  
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getOrderStats = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('status');
  if (error) throw error;
  
  return data.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
};

export const getTodayOrders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', today.toISOString());
  if (error) throw error;
  return data;
};

export const getMonthlyRevenue = async () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  
  const { data, error } = await supabase
    .from('orders')
    .select('total_amount')
    .not('status', 'eq', 'cancelled')
    .gte('created_at', firstDay.toISOString());
  if (error) throw error;
  
  return data.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
};

export const exportOrdersCSV = async (filters = {}) => {
  const data = await getAllOrders(filters);
  if (!data.length) return null;
  
  const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'Total', 'Status'];
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const date = new Date(row.created_at).toLocaleDateString();
    csvRows.push([
      row.order_number,
      date,
      `"${row.customer_name}"`,
      row.customer_phone,
      row.total_amount,
      row.status
    ].join(','));
  });
  
  return csvRows.join('\n');
};
