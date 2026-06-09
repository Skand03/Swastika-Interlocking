import { supabase } from '../supabase/client';

export const getAllProjects = async (filters = {}) => {
  let query = supabase.from('rcc_projects').select('*');
  if (filters.status) query = query.eq('status', filters.status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createProjectEnquiry = async (enquiryData) => {
  const { data, error } = await supabase.from('rcc_projects').insert([enquiryData]).select().single();
  if (error) throw error;
  return data;
};
