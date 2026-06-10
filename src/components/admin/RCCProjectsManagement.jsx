import React, { useState, useEffect } from 'react';
import { useAuth } from "../../auth/AuthContext";
import { getProductsByDivision, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { uploadImage } from "../../services/uploadService";

export default function RCCProjectsManagement({ language, user }) {
  const isHindi = language === 'hi';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: '',
    product_key: '',
    name_en: '',
    name_hi: '',
    desc_en: '',
    desc_hi: '',
    price: '', // location
    stock: '', // length in km
    category: 'RCC',
    image_url: '',
    imageFile: null,
    variants: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProductsByDivision('rcc');
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name_en) {
      setStatusMsg('Please fill in required fields (Name)');
      return;
    }

    try {
      let finalImageUrl = form.image_url;
      if (form.imageFile) {
        try {
          finalImageUrl = await uploadImage(form.imageFile, 'rcc');
        } catch (err) {
          setStatusMsg('Image upload failed.');
          return;
        }
      }

      const productData = {
        name_en: form.name_en,
        name_hi: form.name_hi,
        description_en: form.desc_en,
        description_hi: form.desc_hi,
        price_min: form.price, // mapped to location
        price_max: form.price,
        stock_quantity: form.stock, // mapped to length
        division: 'rcc',
        images: finalImageUrl ? [finalImageUrl] : []
      };

      if (isEditing && form.id) {
        await updateProduct(form.id, productData);
      } else {
        await createProduct(productData);
      }
      
      setStatusMsg(isEditing ? 'RCC Project updated!' : 'RCC Project added!');
      fetchProjects();
      handleCancel();
    } catch (err) {
      console.error(err);
      setStatusMsg('Server error saving project.');
    }
  };

  const handleEdit = (proj) => {
    setIsEditing(true);
    setForm({
      id: proj.id,
      product_key: proj.id, // Supabase doesn't use custom keys typically
      name_en: proj.name_en,
      name_hi: proj.name_hi,
      desc_en: proj.description_en,
      desc_hi: proj.description_hi,
      price: proj.price_min, // mapped to location
      stock: proj.stock_quantity, // mapped to length
      category: 'RCC',
      image_url: proj.images && proj.images.length > 0 ? proj.images[0] : '',
      imageFile: null,
      variants: []
    });
    setStatusMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProduct(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      id: '',
      product_key: '',
      name_en: '',
      name_hi: '',
      desc_en: '',
      desc_hi: '',
      price: '',
      stock: '',
      category: 'RCC',
      image_url: '',
      imageFile: null,
      variants: []
    });
    // setStatusMsg('');
  };

  return (
    <section className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background text-xl font-bold">
            {isHindi ? 'RCC प्रोजेक्ट्स मैनेजमेंट' : 'RCC Projects Management'}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {isHindi ? 'अपनी आरसीसी सड़क परियोजनाओं और छवियों को प्रबंधित करें।' : 'Manage your RCC road projects and gallery images.'}
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <h4 className="font-bold text-lg mb-4 border-b pb-2">
          {isEditing ? (isHindi ? 'प्रोजेक्ट संपादित करें' : 'Edit Project') : (isHindi ? 'नया प्रोजेक्ट जोड़ें' : 'Add New Project')}
        </h4>
        
        {statusMsg && <div className="mb-4 p-3 rounded bg-blue-50 text-blue-800 font-bold text-sm">{statusMsg}</div>}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Project Key (Unique ID)</label>
            <input required value={form.product_key} onChange={e => setForm({...form, product_key: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '')})} className="w-full bg-surface-container-low rounded p-2 focus:ring-2 focus:ring-primary outline-none" disabled={isEditing} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Project Name (English)</label>
            <input required value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} className="w-full bg-surface-container-low rounded p-2 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Project Name (Hindi)</label>
            <input value={form.name_hi} onChange={e => setForm({...form, name_hi: e.target.value})} className="w-full bg-surface-container-low rounded p-2 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Location</label>
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-surface-container-low rounded p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Gurugram" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Length / Size</label>
            <input type="number" value={form.stock} onFocus={e => { if(e.target.value === '0') setForm({...form, stock: ''}); }} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-surface-container-low rounded p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 5 (km)" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Project Image</label>
            <input type="file" accept="image/*" onChange={e => setForm({...form, imageFile: e.target.files[0]})} className="w-full bg-surface-container-low rounded p-2 focus:ring-2 focus:ring-primary outline-none cursor-pointer" />
            {form.image_url && !form.imageFile && <p className="text-xs text-secondary mt-1">Current: <a href={form.image_url} target="_blank" rel="noreferrer" className="hover:underline">{form.image_url}</a></p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-on-surface-variant">Description (English)</label>
            <textarea value={form.desc_en} onChange={e => setForm({...form, desc_en: e.target.value})} className="w-full bg-surface-container-low rounded p-2 focus:ring-2 focus:ring-primary outline-none resize-none" rows="2" />
          </div>

          <div className="md:col-span-2 pt-2 border-t border-outline-variant/30">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-on-surface-variant">Project Variants (e.g. Phase Images, Layouts)</label>
              <button 
                type="button"
                onClick={() => setForm({...form, variants: [...(form.variants || []), { name: '', image_url: '', imageFile: null }]})}
                className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-2 py-1 rounded text-[10px] font-bold transition-colors"
              >
                + Add Option
              </button>
            </div>
            {(form.variants || []).map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2 p-2 bg-surface-container-lowest border border-outline-variant/30 rounded items-center">
                <input 
                  type="text" 
                  placeholder="Variant Name" 
                  value={variant.name}
                  onChange={(e) => {
                    const newVars = [...form.variants];
                    newVars[index].name = e.target.value;
                    setForm({...form, variants: newVars});
                  }}
                  className="flex-1 bg-white border border-outline-variant/30 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none"
                />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const newVars = [...form.variants];
                    newVars[index].imageFile = e.target.files[0];
                    setForm({...form, variants: newVars});
                  }}
                  className="w-40 bg-white border border-outline-variant/30 rounded px-1 py-1 text-[10px] cursor-pointer"
                />
                {variant.image_url && !variant.imageFile && (
                  <img src={variant.image_url} alt="v" className="w-6 h-6 rounded object-cover border border-outline-variant/30" />
                )}
                <button 
                  type="button"
                  onClick={() => {
                    const newVars = form.variants.filter((_, i) => i !== index);
                    setForm({...form, variants: newVars});
                  }}
                  className="text-error hover:bg-error/10 w-6 h-6 rounded flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
          </div>
          <div className="col-span-full flex gap-3 mt-2">
            <button type="submit" className="bg-secondary text-white px-6 py-2 rounded font-bold hover:bg-secondary/90 transition-colors">
              {isEditing ? 'Update Project' : 'Save Project'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-surface-variant/50 text-on-surface px-6 py-2 rounded font-bold hover:bg-surface-variant transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl text-center text-on-surface-variant">No RCC projects found.</div>
        ) : (
          projects.map(proj => (
            <div key={proj.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-outline-variant/20 group">
              <div className="h-48 bg-surface-container relative">
                <img src={proj.image_url || '/images/default-project.jpg'} alt={proj.name_en} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded">RCC</span>
              </div>
              <div className="p-4">
                <h5 className="font-bold text-lg">{isHindi ? proj.name_hi : proj.name_en}</h5>
                <p className="text-xs text-on-surface-variant mt-1 mb-3 line-clamp-2">{proj.desc_en}</p>
                <div className="flex gap-2 text-xs font-bold text-on-surface-variant mb-4">
                  <span className="bg-surface-variant px-2 py-1 rounded">{proj.price || 'N/A'}</span>
                  <span className="bg-surface-variant px-2 py-1 rounded">{proj.stock ? `${proj.stock} km` : 'N/A'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(proj)} className="flex-1 border border-outline-variant py-1.5 rounded hover:border-secondary transition-colors text-xs font-bold">Edit</button>
                  <button onClick={() => handleDelete(proj.id)} className="px-3 border border-red-200 text-error rounded hover:bg-red-50 transition-colors material-symbols-outlined text-sm">delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
