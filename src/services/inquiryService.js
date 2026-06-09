import { supabase } from '../supabase/client';

export const createInquiry = async (inquiryData) => {
  const { data, error } = await supabase.from('inquiries').insert([inquiryData]).select().single();
  if (error) throw error;
  return data;
};

export const getAllInquiries = async (filters = {}) => {
  let query = supabase.from('inquiries').select('*');
  if (filters.status) query = query.eq('status', filters.status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
