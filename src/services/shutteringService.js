import { supabase } from '../supabase/client';

export const getAllRentals = async (filters = {}) => {
  let query = supabase.from('shuttering_rentals').select('*');
  if (filters.status) query = query.eq('status', filters.status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createRentalEnquiry = async (enquiryData) => {
  const { data, error } = await supabase.from('shuttering_rentals').insert([enquiryData]).select().single();
  if (error) throw error;
  return data;
};

export const updateRentalStatus = async (id, status) => {
  const { data, error } = await supabase.from('shuttering_rentals').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};
