import React, { useState } from 'react';

// Helper — get first image from the DB images[] array
const getProductImage = (prod) => {
  if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) return prod.images[0];
  return null;
};

// Helper — format price from DB numeric fields
const formatPrice = (prod) => {
  if (prod.price_min && prod.price_max) {
    return prod.price_min === prod.price_max
      ? `₹${prod.price_min}`
      : `₹${prod.price_min} - ₹${prod.price_max}`;
  }
  if (prod.price_min) return `₹${prod.price_min}`;
  return '—';
};

export default function ProductsManagement({
  language,
  products,
  productForm,
  setProductForm,
  isEditing,
  productStatus,
  productIsSuccess,
  handleSaveProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleCancelEdit,
  handleAddNewProductClick,
}) {
  const isHindi = language === 'hi';
  const [filter, setFilter] = useState('All');

  const divisions = ['All', 'building_materials', 'shuttering'];
  const divisionLabel = { 'All': 'All', 'building_materials': 'Building Materials', 'shuttering': 'Shuttering' };

  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => p.division === filter);

  return (
    <section className="space-y-8" id="products-management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {isHindi ? 'उत्पाद प्रबंधन' : 'Products Management'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {isHindi ? 'कैटलॉग, स्टॉक स्तर और मूल्य निर्धारण नियम प्रबंधित करें।' : 'Manage catalog, stock levels, and pricing.'}
          </p>
        </div>
        <button
          onClick={handleAddNewProductClick}
          className="bg-[#E8650A] hover:bg-[#c25408] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined">add</span>
          {isHindi ? 'नया उत्पाद जोड़ें' : 'Add New Product'}
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {divisions.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer transition-all ${
              filter === d
                ? 'bg-[#E8650A] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E8650A]'
            }`}
          >
            {divisionLabel[d]}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400 self-center whitespace-nowrap">
          {filteredProducts.length} {isHindi ? 'उत्पाद' : 'products'}
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl text-center text-gray-400 font-bold border border-gray-100">
            {isHindi ? 'कोई उत्पाद नहीं मिला।' : 'No products found.'}
          </div>
        ) : (
          filteredProducts.map(prod => {
            const imgSrc = getProductImage(prod);
            const price = formatPrice(prod);
            const stock = prod.stock_quantity ?? 0;
            const isLowStock = stock < 10;
            return (
              <div key={prod.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-md transition-shadow group">
                {/* Image */}
                <div className="h-44 relative overflow-hidden bg-gray-50">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={prod.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <span className="material-symbols-outlined text-5xl">image_not_supported</span>
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow ${isLowStock ? 'bg-red-500' : 'bg-green-600'}`}>
                    {isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-[#E8650A] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {prod.division === 'shuttering' ? 'Shuttering' : 'Building'}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h5 className="font-bold text-base mb-1 truncate" title={isHindi ? prod.name_hi : prod.name_en}>
                    {isHindi ? (prod.name_hi || prod.name_en) : prod.name_en}
                  </h5>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow">
                    {isHindi ? (prod.description_hi || prod.description_en) : prod.description_en}
                  </p>

                  <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price</p>
                      <span className="text-[#E8650A] font-extrabold">{price}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Stock</p>
                      <p className={`font-bold text-sm ${isLowStock ? 'text-red-500' : 'text-gray-700'}`}>{stock} pcs</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(prod)}
                      className="flex-grow border border-gray-200 py-2 rounded-lg text-xs font-bold hover:border-[#E8650A] hover:text-[#E8650A] transition-colors cursor-pointer"
                    >
                      {isHindi ? 'संपादित करें' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="w-9 h-9 border border-gray-200 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
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

      {/* Add / Edit Form */}
      <div id="product-form-container" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl scroll-mt-8">
        <h4 className="text-lg font-bold mb-6 pb-4 border-b border-gray-100">
          {isEditing
            ? (isHindi ? 'उत्पाद संपादित करें' : 'Edit Product')
            : (isHindi ? 'नया उत्पाद जोड़ें' : 'Add New Product')}
        </h4>

        {productStatus && (
          <div className={`p-4 mb-6 rounded-xl font-bold text-sm border ${
            productIsSuccess
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {productIsSuccess ? '✅ ' : '❌ '}{productStatus}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category / Division */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Category</label>
            <select
              value={productForm.category}
              onChange={e => setProductForm({ ...productForm, category: e.target.value })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200"
            >
              <option value="Interlocking Blocks">Interlocking Blocks</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Pipes & Drainage">Pipes & Drainage</option>
              <option value="Shuttering">Shuttering</option>
            </select>
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Stock Quantity</label>
            <input
              value={productForm.stock}
              onFocus={e => { if (e.target.value === '0') setProductForm({ ...productForm, stock: '' }); }}
              onChange={e => setProductForm({ ...productForm, stock: e.target.value === '' ? '' : parseInt(e.target.value) })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200"
              placeholder="0"
              type="number"
              min="0"
            />
          </div>

          {/* Name EN */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Product Name (English) <span className="text-red-500">*</span></label>
            <input
              value={productForm.name_en}
              onChange={e => setProductForm({ ...productForm, name_en: e.target.value })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200"
              placeholder="e.g. Zigzag Paver Blocks"
              type="text"
            />
          </div>

          {/* Name HI */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Product Name (Hindi)</label>
            <input
              value={productForm.name_hi}
              onChange={e => setProductForm({ ...productForm, name_hi: e.target.value })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200"
              placeholder="e.g. ज़िगज़ैग पेवर ब्लॉक"
              type="text"
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Price (e.g. 45 or 45-85)</label>
            <input
              value={productForm.price}
              onChange={e => setProductForm({ ...productForm, price: e.target.value })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200"
              placeholder="e.g. 45 or 45-85"
              type="text"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Product Image</label>
            <input
              key={productForm.image_url} // reset input when editing new product
              onChange={e => setProductForm({ ...productForm, imageFile: e.target.files[0] })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 cursor-pointer text-sm"
              type="file"
              accept="image/*"
            />
            {productForm.image_url && !productForm.imageFile && (
              <div className="flex items-center gap-3 mt-2">
                <img src={productForm.image_url} alt="current" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                <span className="text-xs text-gray-400">Current image</span>
              </div>
            )}
          </div>

          {/* Desc EN */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Description (English)</label>
            <textarea
              value={productForm.desc_en}
              onChange={e => setProductForm({ ...productForm, desc_en: e.target.value })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 resize-none"
              placeholder="Description in English..."
              rows="3"
            />
          </div>

          {/* Desc HI */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-gray-500">Description (Hindi)</label>
            <textarea
              value={productForm.desc_hi}
              onChange={e => setProductForm({ ...productForm, desc_hi: e.target.value })}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 resize-none"
              placeholder="विवरण हिंदी में..."
              rows="3"
            />
          </div>

          {/* Specifications Section */}
          <div className="md:col-span-2 pt-4 border-t border-gray-100">
            <h5 className="font-bold text-sm text-gray-700 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E8650A] text-base">table_chart</span>
              Product Specifications (shown on Details page)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-gray-400 uppercase tracking-wide">Size / Thickness</label>
                <input
                  value={productForm.spec_thickness || ''}
                  onChange={e => setProductForm({ ...productForm, spec_thickness: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 text-sm"
                  placeholder="e.g. 60mm / 80mm"
                  type="text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-gray-400 uppercase tracking-wide">Weight</label>
                <input
                  value={productForm.spec_weight || ''}
                  onChange={e => setProductForm({ ...productForm, spec_weight: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 text-sm"
                  placeholder="e.g. 3.5kg Approx."
                  type="text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-gray-400 uppercase tracking-wide">Compressive Strength</label>
                <input
                  value={productForm.spec_strength || ''}
                  onChange={e => setProductForm({ ...productForm, spec_strength: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 text-sm"
                  placeholder="e.g. M30 to M50 Grade"
                  type="text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-gray-400 uppercase tracking-wide">Color Options</label>
                <input
                  value={productForm.spec_color || ''}
                  onChange={e => setProductForm({ ...productForm, spec_color: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 text-sm"
                  placeholder="e.g. Grey, Red, Yellow"
                  type="text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-gray-400 uppercase tracking-wide">Application</label>
                <input
                  value={productForm.spec_application || ''}
                  onChange={e => setProductForm({ ...productForm, spec_application: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 text-sm"
                  placeholder="e.g. Driveways, Petrol Pumps"
                  type="text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-gray-400 uppercase tracking-wide">Material</label>
                <input
                  value={productForm.spec_material || ''}
                  onChange={e => setProductForm({ ...productForm, spec_material: e.target.value })}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#E8650A] outline-none border border-gray-200 text-sm"
                  placeholder="e.g. High-strength Concrete"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSaveProduct}
            className="bg-[#E8650A] hover:bg-[#c25408] text-white px-8 py-3 rounded-xl font-bold cursor-pointer active:scale-95 transition-all shadow-md"
          >
            {isEditing ? (isHindi ? 'बदलाव सहेजें' : 'Save Changes') : (isHindi ? 'उत्पाद जोड़ें' : 'Add Product')}
          </button>
          <button
            onClick={handleCancelEdit}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-3 rounded-xl font-bold cursor-pointer active:scale-95 transition-all"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>
        </div>
      </div>
    </section>
  );
}
