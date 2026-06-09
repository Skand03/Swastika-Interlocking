import { supabase } from '../supabase/client';

export const getSettings = async () => {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  return data;
};

export const updateSetting = async (key, value) => {
  const { data, error } = await supabase.from('site_settings').update({ value }).eq('key', key).select().single();
  if (error) throw error;
  return data;
};
