import { supabase } from '../supabase/client';

export const getAllCustomers = async (filters = {}) => {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getCustomerById = async (id) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const updateCustomerStatus = async (id, isActive) => {
  const { data, error } = await supabase.from('profiles').update({ is_active: isActive }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};
