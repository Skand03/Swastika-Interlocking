import { supabase } from '../supabase/client';

export const createOrder = async (orderData) => {
  const year = new Date().getFullYear();

  // Get last order number for this year (ignore errors — first order of year)
  const { data: lastOrder } = await supabase
    .from('orders')
    .select('order_number')
    .ilike('order_number', `SW-${year}-%`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle(); // use maybeSingle to avoid throwing when no row found

  let nextNum = 1;
  if (lastOrder?.order_number) {
    const parts = lastOrder.order_number.split('-');
    if (parts.length === 3) nextNum = parseInt(parts[2], 10) + 1;
  }

  const orderNumber = `SW-${year}-${String(nextNum).padStart(3, '0')}`;

  // Clean items — strip local `id` field, ensure price is numeric
  const cleanItems = (orderData.items || []).map(item => ({
    product_id: item.product_id || null,
    product_name: item.product_name || '',
    sub_type: item.sub_type || '',
    quantity: parseInt(item.quantity) || 1,
    price: parseFloat(item.price) || 0,
    image_url: item.image_url || '',
  }));

  const subtotal = cleanItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  const finalOrderData = {
    order_number: orderNumber,
    customer_id: orderData.customer_id,  // required — policy rejects if null or mismatched
    customer_name: orderData.customer_name || '',
    customer_phone: orderData.customer_phone || '',
    delivery_address: orderData.delivery_address || '',
    delivery_city: orderData.delivery_city || '',
    items: cleanItems,
    subtotal: subtotal,
    total_amount: subtotal,
    admin_notes: orderData.admin_notes || null,
    status: 'new',
    payment_status: 'pending',
  };

  const { data, error } = await supabase
    .from('orders')
    .insert([finalOrderData])
    .select()
    .single();

  if (error) throw new Error(error.message);
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
  const uiMap = {
    'new': 'Pending', 'confirmed': 'Processing', 'processing': 'Processing',
    'dispatched': 'Shipped', 'delivered': 'Delivered', 'cancelled': 'Cancelled',
  };
  return (data || []).map(o => ({ ...o, status: uiMap[o.status] || o.status }));
};

export const getAllOrders = async (filters = {}) => {
  let query = supabase.from('orders').select('*');
  if (filters.status) query = query.eq('status', filters.status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  // Normalize DB status → UI labels for backwards compatibility
  const uiMap = {
    'new': 'Pending', 'confirmed': 'Processing', 'processing': 'Processing',
    'dispatched': 'Shipped', 'delivered': 'Delivered', 'cancelled': 'Cancelled',
  };
  return (data || []).map(o => ({ ...o, status: uiMap[o.status] || o.status }));
};

export const updateOrderStatus = async (id, status, adminNotes = null) => {
  // Map UI labels → DB CHECK constraint values
  const statusMap = {
    'Pending': 'new',
    'Processing': 'processing',
    'Shipped': 'dispatched',
    'Delivered': 'delivered',
    'Cancelled': 'cancelled',
    'Confirmed': 'confirmed',
    // pass-through if already a valid DB value
    'new': 'new', 'confirmed': 'confirmed', 'processing': 'processing',
    'dispatched': 'dispatched', 'delivered': 'delivered', 'cancelled': 'cancelled',
  };
  const dbStatus = statusMap[status] || 'new';
  const updates = { status: dbStatus };
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
