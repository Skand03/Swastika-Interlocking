import { supabase } from '../supabase/client';

// Bucket map — matches what's created in Supabase storage
const BUCKET_MAP = {
  products: 'products',
  shuttering: 'products',   // reuse same bucket, different folder
  rcc: 'projects',
  projects: 'projects',
  default: 'products',
};

export const uploadImage = async (file, folder = 'products') => {
  if (!file) return null;

  const bucket = BUCKET_MAP[folder] || BUCKET_MAP.default;
  const fileExt = file.name.split('.').pop().toLowerCase();
  const safeName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
  const filePath = `${folder}/${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    console.error('Image upload error:', uploadError.message);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};
