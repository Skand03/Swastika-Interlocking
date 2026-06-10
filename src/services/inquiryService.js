import { supabase } from '../supabase/client';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseUrl !== '' && supabaseAnonKey && supabaseAnonKey !== '');
};

// Safe list of columns that definitely exist in 'inquiries' table
const SAFE_INQUIRY_COLUMNS = [
  'customer_name',
  'customer_phone',
  'customer_id',
  'city',
  'message',
  'source',
  'division',
  'subject',
  'budget_range'
];

export const createInquiry = async (inquiryData) => {
  // Filter data to only safe columns to avoid schema errors
  const filteredData = {};
  for (const col of SAFE_INQUIRY_COLUMNS) {
    if (inquiryData[col] !== undefined) {
      filteredData[col] = inquiryData[col];
    }
  }

  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, not saving inquiry to DB');
    return { id: Date.now(), ...filteredData, created_at: new Date().toISOString() };
  }
  try {
    const { data, error } = await supabase.from('inquiries').insert([filteredData]).select().single();
    if (error) {
      console.error('Error creating inquiry:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.warn('Failed to save inquiry to DB, returning mock:', err);
    return { id: Date.now(), ...filteredData, created_at: new Date().toISOString() };
  }
};

export const getAllInquiries = async (filters = {}) => {
  if (!isSupabaseConfigured()) return [];
  try {
    let query = supabase.from('inquiries').select('*');
    if (filters.status) query = query.eq('status', filters.status);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Failed to fetch inquiries:', err);
    return [];
  }
};

export const getInquiriesByCustomer = async (customerId) => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Could not fetch customer inquiries (maybe customer_id column doesn't exist yet):", err);
    return []; // Return empty array as fallback
  }
};
