import React, { useState } from 'react';
import { useAuth } from "../../auth/AuthContext";
import { createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { uploadImage } from "../../services/uploadService";

export default function InventoryShuttering({ language, products, fetchProducts, user }) {
  const isHindi = language === 'hi';
  
  // Find raw materials from product list to show live levels
  const rawMaterials = products.filter(p => p.division === 'building_materials' && (p.name_en?.toLowerCase().includes('cement') || p.name_en?.toLowerCase().includes('sand') || p.name_en?.toLowerCase().includes('gravel') || p.name_en?.toLowerCase().includes('grit')));
  const cementProd = rawMaterials.find(p => p.name_en?.toLowerCase().includes('cement')) || { stock_quantity: 140, name_en: 'OPC Cement (Bags)', name_hi: 'ओपीसी सीमेंट (बोरी)' };
  const sandProd = rawMaterials.find(p => p.name_en?.toLowerCase().includes('sand')) || { stock_quantity: 450, name_en: 'Coarse Sand (CFT)', name_hi: 'रेत (CFT)' };
  const gravelProd = rawMaterials.find(p => p.name_en?.toLowerCase().includes('gravel') || p.name_en?.toLowerCase().includes('grit')) || { stock_quantity: 820, name_en: 'Aggregate Gravel (CFT)', name_hi: 'गिट्टी (CFT)' };

  // Calculate percentages based on thresholds
  const cementPct = Math.min(Math.round(((cementProd.stock_quantity || 0) / 500) * 100), 100);
  const sandPct = Math.min(Math.round(((sandProd.stock_quantity || 0) / 600) * 100), 100);
  const gravelPct = Math.min(Math.round(((gravelProd.stock_quantity || 0) / 900) * 100), 100);

  const isLowCement = (cementProd.stock_quantity || 0) < 200;
  const isLowSand = (sandProd.stock_quantity || 0) < 250;
  const isLowGravel = (gravelProd.stock_quantity || 0) < 300;
  const hasAlert = isLowCement || isLowSand || isLowGravel;

  // Form states for manual stock adjustment
  const [selectedProductId, setSelectedProductId] = useState(rawMaterials[0]?.id || '');
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [reason, setReason] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleIncrement = () => setAdjustmentValue(prev => (parseInt(prev) || 0) + 1);
  const handleDecrement = () => setAdjustmentValue(prev => (parseInt(prev) || 0) - 1);

  const handleSubmitAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      setSubmitStatus('Please select a product first.');
      setIsSuccess(false);
      return;
    }
    if (adjustmentValue === 0 || adjustmentValue === '') {
      setSubmitStatus('Adjustment amount cannot be zero.');
      setIsSuccess(false);
      return;
    }

    const selectedProd = products.find(p => String(p.id) === String(selectedProductId));
    if (!selectedProd) return;
    
    const newStock = Math.max(0, parseInt(selectedProd.stock_quantity || selectedProd.stock) + parseInt(adjustmentValue));

    try {
      await updateProduct(selectedProd.id, { stock_quantity: newStock });
      
      setSubmitStatus('Inventory stock level updated successfully.');
      setIsSuccess(true);
      setAdjustmentValue('');
      setReason('');
      fetchProducts();
    } catch (err) {
      console.error(err);
      setSubmitStatus('Server error during inventory update.');
      setIsSuccess(false);
    }
  };

  // --- SHUTTERING CATALOG CRUD ---
  const shutteringItems = products.filter(p => p.division === 'shuttering');
  const [shutForm, setShutForm] = useState({
    id: '', product_key: '', name_en: '', name_hi: '', desc_en: '', desc_hi: '',
    price: '', stock: '', division: 'shuttering', image_url: '', imageFile: null, variants: []
  });
  const [isEditingShut, setIsEditingShut] = useState(false);
  const [shutStatus, setShutStatus] = useState('');

  const handleSaveShut = async (e) => {
    e.preventDefault();
    if (!shutForm.name_en) {
      setShutStatus('English Name is required.'); return;
    }
    try {
      let finalImageUrl = shutForm.image_url;
      if (shutForm.imageFile) {
        try {
          finalImageUrl = await uploadImage(shutForm.imageFile, 'shuttering');
        } catch (err) {
          setShutStatus('Image upload failed.'); return;
        }
      }

      const productData = {
        name_en: shutForm.name_en,
        name_hi: shutForm.name_hi,
        description_en: shutForm.desc_en,
        description_hi: shutForm.desc_hi,
        price_min: shutForm.price, 
        price_max: shutForm.price,
        stock_quantity: shutForm.stock,
        division: 'shuttering',
        images: finalImageUrl ? [finalImageUrl] : []
      };

      if (isEditingShut && shutForm.id) {
        await updateProduct(shutForm.id, productData);
      } else {
        await createProduct(productData);
      }
      
      setShutStatus(isEditingShut ? 'Item updated!' : 'Item added!');
      fetchProducts();
      handleCancelShut();
    } catch (err) {
      console.error(err);
      setShutStatus('Server error saving item.');
    }
  };

  const handleEditShut = (item) => {
    setIsEditingShut(true);
    const priceStr = item.price_min && item.price_max
      ? item.price_min === item.price_max
        ? String(item.price_min)
        : `${item.price_min}-${item.price_max}`
      : String(item.price_min || '');
    setShutForm({ 
      id: item.id, 
      product_key: item.id, 
      name_en: item.name_en, 
      name_hi: item.name_hi, 
      desc_en: item.description_en, 
      desc_hi: item.description_hi, 
      price: priceStr, 
      stock: item.stock_quantity, 
      division: 'shuttering', 
      image_url: item.images && item.images.length > 0 ? item.images[0] : '', 
      imageFile: null, 
      variants: item.specifications?.variants || [] 
    });
    setShutStatus('');
    const el = document.getElementById('shuttering-catalog-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteShut = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shuttering item?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete item.');
    }
  };

  const handleCancelShut = () => {
    setIsEditingShut(false);
    setShutForm({ id: '', product_key: '', name_en: '', name_hi: '', desc_en: '', desc_hi: '', price: '', stock: '', division: 'shuttering', image_url: '', imageFile: null, variants: [] });
  };

  return (
    <div className="space-y-8 animate-fade-in" id="inventory-rentals">
      <div>
        <h3 className="font-headline-md text-headline-md text-on-surface text-xl font-bold">
          {isHindi ? 'इन्वेंटरी और किराया / Inventory & Rentals' : 'Inventory & Rentals / इन्वेंटरी और किराया'}
        </h3>
        <p className="text-on-surface-variant text-sm mt-1">
          {isHindi ? 'कच्चा माल भंडार स्तर और निर्माण शटरिंग किराया ट्रैक करें।' : 'Track raw material stock levels and construction shuttering rentals.'}
        </p>
      </div>

      {hasAlert && (
        <div className="bg-error-container border-l-4 border-error p-4 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error">warning</span>
            <div>
              <p className="text-on-error-container font-bold text-sm">
                {isHindi ? 'स्टॉक कम होने की चेतावनी / Low Stock Alert' : 'Low Stock Alert / स्टॉक कम होने की चेतावनी'}
              </p>
              <p className="text-on-error-container/80 text-xs mt-0.5">
                {isHindi 
                  ? 'कुछ महत्वपूर्ण सामग्रियां न्यूनतम स्तर से नीचे चल रही हैं। कृपया पुनः ऑर्डर करें।' 
                  : 'Important raw materials are running below minimum levels. Please restock.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Section: Material Inventory Progress Bars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-highest">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-wide">
                {isHindi ? 'सीमेंट / Cement' : 'Cement / सीमेंट'}
              </p>
              <h3 className="font-display font-bold text-2xl mt-1">{cementProd.stock_quantity || 0} Bags</h3>
            </div>
            <span className="p-3 bg-surface-container-highest rounded-xl material-symbols-outlined text-primary">layers</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-on-surface-variant">{isHindi ? 'स्टॉक स्तर' : 'Stock Level'}</span>
              <span className={`font-bold ${cementPct < 30 ? 'text-error' : 'text-secondary'}`}>{cementPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${cementPct < 30 ? 'bg-error' : 'bg-secondary'}`} style={{ width: `${cementPct}%` }}></div>
            </div>
            <p className="text-[10px] text-on-surface-variant/60 italic">{isHindi ? 'न्यूनतम: 500 बैग' : 'Minimum: 500 Bags'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-highest">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-wide">
                {isHindi ? 'रेत / Sand' : 'Sand / रेत'}
              </p>
              <h3 className="font-display font-bold text-2xl mt-1">{sandProd.stock_quantity || 0} CFT</h3>
            </div>
            <span className="p-3 bg-surface-container-highest rounded-xl material-symbols-outlined text-secondary">grain</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-on-surface-variant">{isHindi ? 'स्टॉक स्तर' : 'Stock Level'}</span>
              <span className={`font-bold ${sandPct < 30 ? 'text-error' : 'text-secondary'}`}>{sandPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${sandPct < 30 ? 'bg-error' : 'bg-secondary'}`} style={{ width: `${sandPct}%` }}></div>
            </div>
            <p className="text-[10px] text-on-surface-variant/60 italic">{isHindi ? 'न्यूनतम: 600 CFT' : 'Minimum: 600 CFT'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-highest">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-wide">
                {isHindi ? 'गिट्टी / Gravel' : 'Gravel / गिट्टी'}
              </p>
              <h3 className="font-display font-bold text-2xl mt-1">{gravelProd.stock_quantity || 0} CFT</h3>
            </div>
            <span className="p-3 bg-surface-container-highest rounded-xl material-symbols-outlined text-[#E8650A]">diamond</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-on-surface-variant">{isHindi ? 'स्टॉक स्तर' : 'Stock Level'}</span>
              <span className="text-[#E8650A] font-bold">{gravelPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-[#E8650A] transition-all duration-1000" style={{ width: `${gravelPct}%` }}></div>
            </div>
            <p className="text-[10px] text-on-surface-variant/60 italic">{isHindi ? 'न्यूनतम: 900 CFT' : 'Minimum: 900 CFT'}</p>
          </div>
        </div>
      </section>

      {/* Middle Section: Shuttering Rental Tracker */}
      <section className="bg-white rounded-2xl shadow-sm border border-surface-container-highest overflow-hidden">
        <div className="p-6 border-b border-surface-container flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-headline-md font-bold text-lg text-[#1a1a3e]">
              {isHindi ? 'शटरिंग रेंटल ट्रैकर / Shuttering Rental Tracker' : 'Shuttering Rental Tracker / शटरिंग रेंटल ट्रैकर'}
            </h4>
            <p className="text-on-surface-variant text-sm mt-0.5">
              {isHindi ? 'सक्रिय किराया और वापसी के कार्यक्रम की निगरानी करें।' : 'Monitor active rentals and return schedules.'}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                <th className="p-6">Customer / ग्राहक</th>
                <th className="p-6">Items / सामान</th>
                <th className="p-6 text-center">Qty / मात्रा</th>
                <th className="p-6">Due Date / नियत तिथि</th>
                <th className="p-6">Status / स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-sm">
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1a1a3e]">Rajesh Developers</span>
                    <span className="text-xs text-on-surface-variant">ID: #SH-4021</span>
                  </div>
                </td>
                <td className="p-6">Steel Plates (9x3), Props</td>
                <td className="p-6 text-center font-bold">45 Units</td>
                <td className="p-6">Oct 24, 2023</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-red-100 text-error rounded-full text-xs font-bold border border-red-200">
                    Overdue / विलंबित
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1a1a3e]">Shree Sai Builders</span>
                    <span className="text-xs text-on-surface-variant">ID: #SH-4025</span>
                  </div>
                </td>
                <td className="p-6">Adjustable Props (12ft)</td>
                <td className="p-6 text-center font-bold">120 Units</td>
                <td className="p-6">Oct 28, 2023</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-green-100 text-secondary border border-green-200 rounded-full text-xs font-bold">
                    Due Today / आज
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1a1a3e]">Global Infrastructure</span>
                    <span className="text-xs text-on-surface-variant">ID: #SH-3998</span>
                  </div>
                </td>
                <td className="p-6">Column Boxes, H-Beams</td>
                <td className="p-6 text-center font-bold">32 Units</td>
                <td className="p-6">Nov 02, 2023</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-gray-100 text-on-surface-variant border border-outline-variant/35 rounded-full text-xs font-bold">
                    In Use / चालू
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Section: Update Stock Form & Visual Statistics Card */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container-highest">
          <h4 className="font-headline-md font-bold text-[#1a1a3e] text-lg mb-6">
            {isHindi ? 'इन्वेंटरी अपडेट करें / Update Inventory' : 'Update Inventory / इन्वेंटरी अपडेट करें'}
          </h4>
          
          {submitStatus && (
            <div className={`p-4 mb-6 rounded-xl font-bold text-sm border ${
              isSuccess ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {submitStatus}
            </div>
          )}

          <form onSubmit={handleSubmitAdjustment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'सामग्री का प्रकार' : 'Material Type'}</label>
                <select 
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-[#E8650A] outline-none text-sm cursor-pointer"
                >
                  <option value="">{isHindi ? 'सामग्री चुनें' : 'Select Material'}</option>
                  {rawMaterials.map(p => (
                    <option key={p.id} value={p.id}>{isHindi ? p.name_hi : p.name_en} (Stock: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'समायोजन (Qty +/-)' : 'Adjustment (Qty)'}</label>
                <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden">
                  <button className="px-4 py-3 bg-white hover:bg-surface-container transition-colors text-[#1a1a3e] font-black cursor-pointer select-none" type="button" onClick={handleDecrement}>-</button>
                  <input className="flex-1 bg-transparent border-none text-center font-bold outline-none focus:ring-0 text-sm" type="number" value={adjustmentValue} onFocus={(e) => { if(e.target.value === '0' || e.target.value === 0) setAdjustmentValue('') }} onChange={e => setAdjustmentValue(e.target.value)} />
                  <button className="px-4 py-3 bg-white hover:bg-surface-container transition-colors text-[#1a1a3e] font-black cursor-pointer select-none" type="button" onClick={handleIncrement}>+</button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase">{isHindi ? 'अपडेट का कारण' : 'Reason for Update'}</label>
              <textarea 
                className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 focus:ring-2 focus:ring-[#E8650A] outline-none text-sm resize-none" 
                placeholder={isHindi ? "अपडेट का विवरण दर्ज करें..." : "Damage, regular usage, or new shipment arrival..."} 
                rows="3" value={reason} onChange={e => setReason(e.target.value)}
              ></textarea>
            </div>
            <button className="w-full bg-[#E8650A] hover:bg-[#c25408] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 transition-all text-sm cursor-pointer" type="submit">
              {isHindi ? 'लेन-देन सहेजें' : 'Save Transaction'} <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>

        {/* Visual Insights Card */}
        <div className="bg-[#1C2B1A] p-8 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-center text-white border border-white/5">
          <div className="relative z-10">
            <h3 className="font-display font-bold text-3xl leading-tight mb-4">
              Stock Value Insights<br/>
              <span className="text-primary-fixed text-lg font-medium">{isHindi ? 'स्टॉक मूल्य अंतर्दृष्टि' : 'Material valuation & statistics'}</span>
            </h3>
            <p className="text-white/70 text-sm mb-8 max-w-sm leading-relaxed">
              {isHindi 
                ? 'कुल इन्वेंट्री परिसंपत्ति मूल्य वर्तमान में ₹24,50,000 होने का अनुमान है। उत्पादन में रुकावट रोकने के लिए इष्टतम स्तर बनाए रखें।'
                : 'Total inventory asset value is currently estimated at ₹24,50,000. Maintain optimal levels to prevent production downtime.'}
            </p>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <span className="text-[10px] uppercase opacity-60 block tracking-wider">{isHindi ? 'दैनिक औसत' : 'Avg Consumption'}</span>
                <p className="text-lg font-bold mt-1">850 kg/day</p>
              </div>
              <div className="flex-1 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <span className="text-[10px] uppercase opacity-60 block tracking-wider">{isHindi ? 'रीऑर्डर अवधि' : 'Reorder Period'}</span>
                <p className="text-lg font-bold mt-1">4 Days</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#E8650A]/10 rounded-full blur-[100px]"></div>
          <div className="absolute -left-10 top-0 w-40 h-40 bg-white/5 rounded-full blur-[60px]"></div>
        </div>
      </section>

      {/* NEW: Shuttering Catalog Management Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container-highest" id="shuttering-catalog-form">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 mb-6">
          <h4 className="font-headline-md font-bold text-[#1a1a3e] text-lg">
            {isHindi ? 'शटरिंग सामग्री कैटलॉग प्रबंधित करें' : 'Manage Shuttering Materials Catalog'}
          </h4>
        </div>

        {shutStatus && <div className="mb-4 p-3 rounded bg-blue-50 text-blue-800 font-bold text-sm">{shutStatus}</div>}

        <form onSubmit={handleSaveShut} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Product Key (Unique ID)</label>
            <input required value={shutForm.product_key} onChange={e => setShutForm({...shutForm, product_key: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '')})} className="w-full bg-white rounded p-2 focus:ring-2 focus:ring-primary outline-none" disabled={isEditingShut} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Item Name (English)</label>
            <input required value={shutForm.name_en} onChange={e => setShutForm({...shutForm, name_en: e.target.value})} className="w-full bg-white rounded p-2 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Item Name (Hindi)</label>
            <input value={shutForm.name_hi} onChange={e => setShutForm({...shutForm, name_hi: e.target.value})} className="w-full bg-white rounded p-2 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Rental Rate / Price</label>
            <input value={shutForm.price} onChange={e => setShutForm({...shutForm, price: e.target.value})} className="w-full bg-white rounded p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. ₹5 / day" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Available Stock</label>
            <input type="number" value={shutForm.stock} onFocus={(e) => { if(e.target.value === '0' || e.target.value === 0) setShutForm({...shutForm, stock: ''}) }} onChange={e => setShutForm({...shutForm, stock: e.target.value})} className="w-full bg-white rounded p-2 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Image File</label>
            <input type="file" accept="image/*" onChange={e => setShutForm({...shutForm, imageFile: e.target.files[0]})} className="w-full bg-white rounded p-2 focus:ring-2 focus:ring-primary outline-none cursor-pointer" />
            {shutForm.image_url && !shutForm.imageFile && <p className="text-xs text-secondary mt-1">Current: <a href={shutForm.image_url} target="_blank" rel="noreferrer" className="hover:underline">{shutForm.image_url}</a></p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-on-surface-variant">Description</label>
            <textarea value={shutForm.desc_en} onChange={e => setShutForm({...shutForm, desc_en: e.target.value})} className="w-full bg-white rounded p-2 focus:ring-2 focus:ring-primary outline-none resize-none" rows="2" />
          </div>

          <div className="md:col-span-2 pt-2 border-t border-outline-variant/30">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-on-surface-variant">Shuttering Options (e.g. Plate Types, Sizes)</label>
              <button 
                type="button"
                onClick={() => setShutForm({...shutForm, variants: [...(shutForm.variants || []), { name: '', image_url: '', imageFile: null }]})}
                className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-2 py-1 rounded text-[10px] font-bold transition-colors"
              >
                + Add Option
              </button>
            </div>
            {(shutForm.variants || []).map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2 p-2 bg-surface-container-lowest border border-outline-variant/30 rounded items-center">
                <input 
                  type="text" 
                  placeholder="Variant Name" 
                  value={variant.name}
                  onChange={(e) => {
                    const newVars = [...shutForm.variants];
                    newVars[index].name = e.target.value;
                    setShutForm({...shutForm, variants: newVars});
                  }}
                  className="flex-1 bg-white border border-outline-variant/30 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none"
                />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const newVars = [...shutForm.variants];
                    newVars[index].imageFile = e.target.files[0];
                    setShutForm({...shutForm, variants: newVars});
                  }}
                  className="w-40 bg-white border border-outline-variant/30 rounded px-1 py-1 text-[10px] cursor-pointer"
                />
                {variant.image_url && !variant.imageFile && (
                  <img src={variant.image_url} alt="v" className="w-6 h-6 rounded object-cover border border-outline-variant/30" />
                )}
                <button 
                  type="button"
                  onClick={() => {
                    const newVars = shutForm.variants.filter((_, i) => i !== index);
                    setShutForm({...shutForm, variants: newVars});
                  }}
                  className="text-error hover:bg-error/10 w-6 h-6 rounded flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
          </div>

          <div className="col-span-full flex gap-3 mt-2">
            <button type="submit" className="bg-[#E8650A] text-white px-6 py-2 rounded font-bold hover:bg-[#c25408] transition-colors shadow-sm">
              {isEditingShut ? 'Update Item' : 'Save Item'}
            </button>
            <button type="button" onClick={handleCancelShut} className="bg-surface-variant/50 text-on-surface px-6 py-2 rounded font-bold hover:bg-surface-variant transition-colors">
              Cancel
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shutteringItems.length === 0 ? (
            <p className="col-span-full text-on-surface-variant">No shuttering items found.</p>
          ) : (
            shutteringItems.map(item => {
              const priceStr = item.price_min && item.price_max
                ? item.price_min === item.price_max
                  ? String(item.price_min)
                  : `${item.price_min}-${item.price_max}`
                : String(item.price_min || '');
              return (
                <div key={item.id} className="border border-outline-variant/30 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-surface-container-lowest">
                  <img src={(item.images && item.images.length > 0 ? item.images[0] : '/images/default-product.jpg')} alt={item.name_en} className="w-full h-32 object-cover bg-surface-container" />
                  <div className="p-4 flex-grow flex flex-col">
                    <h5 className="font-bold">{isHindi ? (item.name_hi || item.name_en) : item.name_en}</h5>
                    <div className="flex justify-between items-center my-3 text-xs">
                      <span className="font-bold text-[#E8650A]">{priceStr}</span>
                      <span className="font-bold bg-surface-variant px-2 py-0.5 rounded">Stock: {item.stock_quantity || 0}</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleEditShut(item)} className="flex-grow border border-outline-variant py-1.5 rounded hover:border-secondary transition-colors text-xs font-bold">Edit</button>
                      <button onClick={() => handleDeleteShut(item.id)} className="px-3 border border-red-200 text-error rounded hover:bg-red-50 transition-colors material-symbols-outlined text-sm">delete</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
