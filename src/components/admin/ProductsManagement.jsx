import React, { useState } from 'react';

export default function ProductsManagement({
  language,
  products,
  productForm,
  setProductForm,
  isEditing,
  setIsEditing,
  productStatus,
  productIsSuccess,
  handleSaveProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleCancelEdit,
  handleAddNewProductClick
}) {
  const isHindi = language === 'hi';
  const [filter, setFilter] = useState('All');

  // Filter products by category
  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => {
        if (filter === 'Heavy Duty') return p.category === 'Interlocking Blocks' && (p.name_en?.toLowerCase().includes('heavy') || p.price?.includes('85'));
        if (filter === 'Landscaping') return p.category === 'Interlocking Blocks' && !p.name_en?.toLowerCase().includes('heavy');
        if (filter === 'RCC Pipes') return p.category === 'Pipes & Drainage';
        return p.category === filter;
      });

  const categories = ['All', 'Heavy Duty', 'Landscaping', 'RCC Pipes'];

  return (
    <section className="space-y-8 animate-fade-in" id="products-management">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-background text-xl font-bold">
            {isHindi ? 'उत्पाद प्रबंधन / Products' : 'Products Management / उत्पाद प्रबंधन'}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {isHindi ? 'कैटलॉग, स्टॉक स्तर और मूल्य निर्धारण नियम प्रबंधित करें।' : 'Manage your catalog, stock levels, and pricing rules.'}
          </p>
        </div>
        <button 
          onClick={handleAddNewProductClick}
          className="bg-[#E8650A] hover:bg-[#c25408] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined">add</span> 
          {isHindi ? 'नया उत्पाद जोड़ें' : 'Add New Product'}
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              filter === c
                ? 'bg-[#E8650A] text-white shadow-sm'
                : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-[#E8650A]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl text-center font-bold text-on-surface-variant shadow-sm border border-outline-variant/20">
            {isHindi ? 'कोई उत्पाद नहीं मिला।' : 'No products found.'}
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const isLowStock = parseInt(prod.stock) < 100;
            return (
              <div key={prod.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col group border border-outline-variant/20 hover:shadow-md transition-shadow">
                <div className="h-48 relative overflow-hidden bg-surface-container select-none">
                  <img 
                    alt={prod.name_en} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={prod.image_url || '/images/default-product.jpg'} 
                  />
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase text-white shadow ${
                    isLowStock ? 'bg-error' : 'bg-secondary'
                  }`}>
                    {isLowStock ? (isHindi ? 'कम स्टॉक' : 'Low Stock') : (isHindi ? 'स्टॉक में' : 'In Stock')}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-[#E8650A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {prod.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h5 className="font-bold text-lg mb-1">{isHindi ? prod.name_hi : prod.name_en}</h5>
                  <p className="text-on-surface-variant text-xs mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {isHindi ? prod.desc_hi : prod.desc_en}
                  </p>
                  <div className="flex items-center justify-between mb-4 border-t border-outline-variant/10 pt-4">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{isHindi ? 'मूल्य' : 'Price'}</p>
                      <span className="text-[#E8650A] font-extrabold text-base">{prod.price}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{isHindi ? 'स्टॉक' : 'Stock'}</p>
                      <p className={`font-bold text-sm ${isLowStock ? 'text-error' : ''}`}>{prod.stock} pcs</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => handleEditProduct(prod)}
                      className="flex-grow border border-outline-variant/30 py-2 rounded-lg text-xs font-bold hover:bg-surface hover:border-[#E8650A] transition-colors cursor-pointer"
                    >
                      {isHindi ? 'संपादित करें' : 'Edit Product'}
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center rounded-lg text-error hover:bg-error/10 hover:border-error/30 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Form Section */}
      <div id="product-form-container" className="bg-white p-card-padding rounded-2xl shadow-sm border border-outline-variant/30 max-w-4xl mt-12">
        <h4 className="font-headline-md text-lg font-bold mb-6 border-b border-surface-variant pb-4">
          {isEditing 
            ? (isHindi ? 'उत्पाद संपादित करें / Edit Product Details' : 'Edit Product Details / उत्पाद संपादित करें')
            : (isHindi ? 'नया उत्पाद जोड़ें / Add New Product' : 'Add New Product / नया उत्पाद जोड़ें')}
        </h4>
        
        {productStatus && (
          <div className={`p-4 mb-6 rounded-xl font-bold text-sm border ${
            productIsSuccess 
              ? 'bg-green-100 text-green-800 border-green-200 shadow-green-100/50' 
              : 'bg-red-100 text-red-800 border-red-200 shadow-red-100/50'
          }`}>
            {productStatus}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Product Key (Unique URL key, e.g. zigzag, i-shape)</label>
            <input 
              value={productForm.product_key}
              onChange={e => setProductForm({...productForm, product_key: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '')})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none" 
              placeholder="e.g. zigzag" 
              type="text"
              disabled={isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Category</label>
            <select 
              value={productForm.category}
              onChange={e => setProductForm({...productForm, category: e.target.value})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none"
            >
              <option value="Interlocking Blocks">Interlocking Blocks</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Pipes & Drainage">Pipes & Drainage</option>
              <option value="Shuttering">Shuttering</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Product Name (English)</label>
            <input 
              value={productForm.name_en}
              onChange={e => setProductForm({...productForm, name_en: e.target.value})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none" 
              placeholder="e.g. Zigzag Paver Blocks" 
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Product Name (Hindi)</label>
            <input 
              value={productForm.name_hi}
              onChange={e => setProductForm({...productForm, name_hi: e.target.value})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none" 
              placeholder="e.g. ज़िगज़ैग पेवर ब्लॉक" 
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Price Range (e.g. ₹45 - ₹85 / sq.ft)</label>
            <input 
              value={productForm.price}
              onChange={e => setProductForm({...productForm, price: e.target.value})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none" 
              placeholder="e.g. ₹45 - ₹85 / sq.ft" 
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Stock Quantity</label>
            <input 
              value={productForm.stock}
              onFocus={(e) => { if(e.target.value === '0' || e.target.value === 0) setProductForm({...productForm, stock: ''}) }}
              onChange={e => setProductForm({...productForm, stock: e.target.value === '' ? '' : parseInt(e.target.value)})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none" 
              placeholder="0" 
              type="number"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Product Image</label>
            <input 
              onChange={e => setProductForm({...productForm, imageFile: e.target.files[0]})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none cursor-pointer" 
              type="file"
              accept="image/*"
            />
            {productForm.image_url && !productForm.imageFile && (
              <p className="text-xs text-on-surface-variant mt-1">Current Image: <a href={productForm.image_url} target="_blank" rel="noreferrer" className="text-secondary hover:underline">{productForm.image_url}</a></p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Description (English)</label>
            <textarea 
              value={productForm.desc_en}
              onChange={e => setProductForm({...productForm, desc_en: e.target.value})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none resize-none" 
              placeholder="Enter description in English..." 
              rows="3"
            ></textarea>
          </div>
          <div className="space-y-2">
            <label className="font-bold text-sm text-on-surface-variant">Description (Hindi)</label>
            <textarea 
              value={productForm.desc_hi}
              onChange={e => setProductForm({...productForm, desc_hi: e.target.value})}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none resize-none" 
              placeholder="Enter description in Hindi..." 
              rows="3"
            ></textarea>
          </div>

          {/* Variants / Color Palettes Section */}
          <div className="md:col-span-2 mt-4 pt-4 border-t border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-sm text-on-surface-variant">Product Variants / Options (e.g. Colors, Brands, Sizes)</label>
              <button 
                type="button"
                onClick={() => setProductForm({...productForm, variants: [...(productForm.variants || []), { name: '', image_url: '', imageFile: null }]})}
                className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1.5 rounded text-xs font-bold transition-colors"
              >
                + Add Option
              </button>
            </div>
            
            {(productForm.variants || []).map((variant, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl items-start sm:items-center">
                <div className="flex-1 w-full">
                  <input 
                    type="text" 
                    placeholder="Variant Name (e.g. Red, ACC Cement)" 
                    value={variant.name}
                    onChange={(e) => {
                      const newVars = [...productForm.variants];
                      newVars[index].name = e.target.value;
                      setProductForm({...productForm, variants: newVars});
                    }}
                    className="w-full bg-white border border-outline-variant/30 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div className="flex-1 w-full flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const newVars = [...productForm.variants];
                      newVars[index].imageFile = e.target.files[0];
                      setProductForm({...productForm, variants: newVars});
                    }}
                    className="w-full bg-white border border-outline-variant/30 rounded px-2 py-1.5 text-xs cursor-pointer"
                  />
                  {variant.image_url && !variant.imageFile && (
                    <img src={variant.image_url} alt="variant" className="w-8 h-8 rounded object-cover border border-outline-variant/30" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const newVars = productForm.variants.filter((_, i) => i !== index);
                    setProductForm({...productForm, variants: newVars});
                  }}
                  className="w-8 h-8 flex shrink-0 items-center justify-center text-error hover:bg-error/10 rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
            {(!productForm.variants || productForm.variants.length === 0) && (
              <p className="text-xs text-on-surface-variant italic">No variants added. This product will display without color/option choices.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={handleSaveProduct}
            className="bg-[#E8650A] hover:bg-[#c25408] text-white px-8 py-3 rounded-xl font-bold transition-all cursor-pointer active:scale-95 shadow-md"
          >
            {isEditing ? (isHindi ? 'बदलाव सहेजें' : 'Save Changes') : (isHindi ? 'उत्पाद जोड़ें' : 'Add Product')}
          </button>
          <button 
            onClick={handleCancelEdit}
            className="bg-surface-variant/50 hover:bg-surface-variant/85 text-on-surface-variant px-8 py-3 rounded-xl font-bold transition-all cursor-pointer active:scale-95"
          >
            {isHindi ? 'रद्द करें / रीसेट' : 'Cancel / Reset'}
          </button>
        </div>
      </div>
    </section>
  );
}
