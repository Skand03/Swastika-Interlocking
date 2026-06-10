import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import SEOHead from '../components/SEO/SEOHead';
import { getBreadcrumbSchema } from '../components/SEO/schemas';


const TRANSLATIONS = {
  hi: {
    title: 'बुक आर्डर',
    sub: 'अटूट नींव के लिए प्रीमियम इंटरलॉकिंग पेवर्स। कोटेशन और डिलीवरी शेड्यूल के लिए नीचे विवरण भरें।',
    requiredErr: 'कृपया सभी आवश्यक क्षेत्रों (*) को भरें।',
    name: 'नाम',
    namePlaceholder: 'पूरा नाम दर्ज करें',
    phone: 'फ़ोन नंबर',
    city: 'शहर या गाँव',
    cityPlaceholder: 'स्थान दर्ज करें',
    product: 'उत्पाद चुनें',
    selectProduct: 'उत्पाद सूची',
    quantity: 'मात्रा',
    quantityPlaceholder: 'मात्रा दर्ज करें',
    address: 'डिलिवरी का पता',
    addressPlaceholder: 'लैंडमार्क के साथ पूरा पता दर्ज करें',
    requirements: 'विशेष आवश्यकताएं',
    requirementsPlaceholder: 'कोई विशेष निर्देश?',
    submitBtn: 'ऑर्डर सबमिट करें',
    processing: 'प्रक्रिया में है...',
    successMsg: 'आपका ऑर्डर बुकिंग अनुरोध सफलतापूर्वक दर्ज कर लिया गया है! ऑर्डर आईडी: ',
    successMsgEnd: '। हम पुष्टि के लिए जल्द ही आपसे संपर्क करेंगे।',
    failMsg: 'ऑर्डर बुकिंग में समस्या आई। कृपया पुनः प्रयास करें।',
    connErr: 'सर्वर से कनेक्ट करने में विफलता। कृपया इंटरनेट कनेक्शन या स्थानीय XAMPP सर्वर जांचें।',
    instructions: 'निर्देश',
    inst1: 'स्थापना क्षेत्र की सटीक माप सुनिश्चित करें।',
    inst2: 'ड्राइववे और भारी वाहनों के लिए हेवी ड्यूटी ब्लॉक की सिफारिश की जाती है।',
    inst3: 'ऑर्डर की पुष्टि के बाद सामान्य तौर पर डिलीवरी में 3-5 कार्य दिवस लगते हैं।',
    needHelp: 'सहायता चाहिए?',
    helpSub: 'मात्रा और उत्पाद चयन पर मार्गदर्शन के लिए हमारे उत्पाद विशेषज्ञ से बात करें।',
    callUs: 'कॉल करें',
    waSupport: 'WhatsApp सहायता',
    chatSpecialist: 'विशेषज्ञ से चैट करें',
    color: 'विकल्प',
    selectColor: 'विकल्प चुनें',
    addToList: 'सूची में जोड़ें',
    selectedItems: 'चयनित उत्पाद (डैशबोर्ड)',
    emptyCart: 'कोई उत्पाद नहीं चुना गया।',
    totalItems: 'कुल उत्पाद'
  },
  en: {
    title: 'Book Your Order',
    sub: 'Premium interlocking pavers for unshakeable foundations. Fill in the details below to receive a formal quotation and delivery schedule.',
    requiredErr: 'Please fill in all required fields (*).',
    name: 'Name',
    namePlaceholder: 'Enter full name',
    phone: 'Phone Number',
    city: 'City or Village',
    cityPlaceholder: 'Enter location',
    product: 'Select Product',
    selectProduct: 'Choose from list',
    quantity: 'Quantity',
    quantityPlaceholder: 'Enter quantity',
    address: 'Delivery Address',
    addressPlaceholder: 'Full address with landmark',
    requirements: 'Special Requirements',
    requirementsPlaceholder: 'Any specific instructions?',
    submitBtn: 'Submit Order',
    processing: 'Processing...',
    successMsg: 'Your order booking request has been successfully registered! Order ID: ',
    successMsgEnd: '. We will contact you soon for confirmation.',
    failMsg: 'There was a problem booking your order. Please try again.',
    connErr: 'Failed to connect to server. Please check internet connection or local XAMPP server.',
    instructions: 'Instructions',
    inst1: 'Ensure accurate measurements of the installation area.',
    inst2: 'Heavy duty blocks are recommended for industrial driveways.',
    inst3: 'Delivery usually takes 3-5 working days from order confirmation.',
    needHelp: 'Need Help?',
    helpSub: 'Talk to our product expert for guidance on quantity and product selection.',
    callUs: 'Call Us',
    waSupport: 'WhatsApp Support',
    chatSpecialist: 'Chat with Specialist',
    color: 'Options',
    selectColor: 'Select Option',
    addToList: 'Add to List',
    selectedItems: 'Selected Products Dashboard',
    emptyCart: 'No products selected yet.',
    totalItems: 'Total Items'
  }
};

export default function Order({ language }) {
  const location = useLocation();
  const t = TRANSLATIONS[language];
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    city: '',
    address: '',
    special_req: ''
  });

  // Current item being added
  const [currentItem, setCurrentItem] = useState({
    product_type: '',
    sub_type: '',
    quantity: ''
  });

  const [cart, setCart] = useState([]);
  const [productList, setProductList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    import('../services/productService').then(({ getProductsByDivision }) => {
      getProductsByDivision('building_materials')
        .then(data => {
          setProductList(data);
          if (location.state && location.state.selectedProduct) {
            const preSelected = data.find(p => p.name_en === location.state.selectedProduct || p.name_hi === location.state.selectedProduct);
            if (preSelected) {
              setCurrentItem(prev => ({
                ...prev,
                product_type: preSelected.id
              }));
            }
          }
        })
        .catch(err => console.error("Error fetching products:", err));
    });
  }, [location.state]);

  const { profile } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsLoggedIn(true);
      setFormData(prev => ({
        ...prev,
        customer_name: profile.full_name || prev.customer_name,
        phone: profile.phone || prev.phone,
        city: profile.city || prev.city,
        address: profile.address || prev.address
      }));
      console.log("PROFILE LOADED:", profile);
    } else {
      setIsLoggedIn(false);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    if (name === 'product_type') {
      setCurrentItem(prev => ({ ...prev, product_type: value, sub_type: '' }));
    } else {
      setCurrentItem(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddToCart = () => {
    if (!currentItem.product_type || !currentItem.quantity) {
      alert(language === 'hi' ? 'कृपया उत्पाद और मात्रा चुनें।' : 'Please select a product and enter quantity.');
      return;
    }
    
    // Find product details
    const selectedProd = productList.find(p => p.id === currentItem.product_type);
    
    setCart([...cart, {
      id: Date.now(),
      product_id: currentItem.product_type,
      product_name: selectedProd ? selectedProd.name_en : currentItem.product_type,
      sub_type: currentItem.sub_type,
      quantity: parseInt(currentItem.quantity),
      price: selectedProd ? selectedProd.price_min : 0,
      image_url: selectedProd && selectedProd.images && selectedProd.images.length > 0 ? selectedProd.images[0] : ''
    }]);

    setCurrentItem({
      product_type: '',
      sub_type: '',
      quantity: ''
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.phone || !formData.address || !formData.city) {
      setStatusMsg(t.requiredErr);
      setIsSuccess(false);
      return;
    }

    if (formData.phone.length !== 10) {
      setStatusMsg(language === 'hi' ? 'फ़ोन नंबर ठीक 10 अंकों का होना चाहिए।' : 'Phone number must be exactly 10 digits.');
      setIsSuccess(false);
      return;
    }

    let finalCart = [...cart];

    // Auto-add product if they forgot to click "Add to List"
    if (currentItem.product_type && currentItem.quantity) {
      const selectedProd = productList.find(p => p.id === currentItem.product_type);
      finalCart.push({
        id: Date.now(),
        product_id: currentItem.product_type,
        product_name: selectedProd ? selectedProd.name_en : currentItem.product_type,
        sub_type: currentItem.sub_type,
        quantity: parseInt(currentItem.quantity),
        price: selectedProd ? selectedProd.price_min : 0,
        image_url: selectedProd && selectedProd.images && selectedProd.images.length > 0 ? selectedProd.images[0] : ''
      });
      setCart(finalCart);
      setCurrentItem({ product_type: '', sub_type: '', quantity: '' });
    }

    if (loading) return;

    if (finalCart.length === 0) {
      setStatusMsg(language === 'hi' ? 'कृपया कम से कम एक उत्पाद जोड़ें।' : 'Please add at least one product to the list.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setStatusMsg('');

    try {
      const { createOrder } = await import('../services/orderService');
      const { notifyNewOrder } = await import('../services/whatsappService');
      
      const totalAmount = finalCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const orderData = {
        customer_id: profile ? profile.id : null,
        customer_name: formData.customer_name,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        delivery_city: formData.city,
        items: finalCart,
        subtotal: totalAmount,
        total_amount: totalAmount,
        admin_notes: formData.special_req || null
      };

      const result = await createOrder(orderData);
      
      if (result) {
        setIsSuccess(true);
        setStatusMsg(t.successMsg + result.order_number + t.successMsgEnd);
        
        // Try to open WhatsApp but catch if popup blocked
        try {
          notifyNewOrder(result);
        } catch(e) {}
        
        setFormData({
          customer_name: '',
          phone: '',
          city: '',
          address: '',
          special_req: ''
        });
        setCart([]);
      } else {
        throw new Error('Order creation failed');
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg((language === 'hi' ? 'कनेक्शन एरर: ' : 'Connection error: ') + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Find currently selected product object for variants
  const activeProductObj = productList.find(p => p.id == currentItem.product_type);

  return (
    <main className="pt-32 pb-20 px-gutter max-w-container-max mx-auto min-h-screen">
      <SEOHead
        title="Book Order - Paver Blocks & Building Materials | Swastika Interlocking Deesa"
        description="Book your order for interlocking paver blocks, sand, gravel, cement or shuttering materials from Swastika Interlocking, Deesa. Fast delivery in Banaskantha, Gujarat."
        keywords="order paver blocks Deesa, buy interlocking blocks Gujarat, book building materials Banaskantha, shuttering on rent Deesa"
        url="/order"
        breadcrumb={getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Book Order', path: '/order' }])}
        language={language}
      />
      {/* Page Header */}
      <div className="mb-12 text-center md:text-left select-none">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">{t.title}</h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Order Form Section */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-low p-card-padding rounded-xl border border-surface-variant/30 shadow-sm transition-all duration-300">
            {statusMsg && (
              <div className={`flex items-start gap-4 p-5 rounded-xl mb-6 border-2 shadow-lg animate-bounce-once transition-all duration-500 ${
                isSuccess
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400 shadow-emerald-200'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400 shadow-red-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSuccess ? 'bg-white/20' : 'bg-white/20'}`}>
                  <span className="material-symbols-outlined text-2xl text-white" style={{fontVariationSettings: "'FILL' 1"}}>
                    {isSuccess ? 'check_circle' : 'error'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base mb-0.5">
                    {isSuccess ? (language === 'hi' ? 'ऑर्डर सफलतापूर्वक बुक हुआ!' : 'Order Successfully Booked!') : (language === 'hi' ? 'कुछ गलत हुआ' : 'Something went wrong')}
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed">{statusMsg}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6" id="orderForm">
              
              <div className="bg-white p-4 md:p-6 rounded-xl border border-outline-variant/30 shadow-sm mb-8">
                <h3 className="font-bold text-lg mb-4 text-[#E8650A] border-b pb-2">1. Add Products to Order</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  {/* Product Type */}
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="text-on-surface-variant font-label-sm font-medium">{t.product}</label>
                    <div className="relative flex items-center">
                      <select 
                        name="product_type"
                        value={currentItem.product_type}
                        onChange={handleItemChange}
                        className="w-full bg-surface border border-outline/20 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer text-sm"
                      >
                        <option value="">{t.selectProduct}</option>
                        {productList.map(p => (
                          <option key={p.id} value={p.id}>
                            {language === 'hi' ? p.name_hi : p.name_en}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>
                  </div>

                  {/* Conditional Variants/Options */}
                  {activeProductObj && activeProductObj.variants && activeProductObj.variants.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-on-surface-variant font-label-sm font-medium">{t.color}</label>
                      <div className="relative flex items-center">
                        <select 
                          name="sub_type" 
                          value={currentItem.sub_type} 
                          onChange={handleItemChange} 
                          className="w-full bg-surface border border-outline/20 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none text-sm"
                        >
                          <option value="">{t.selectColor}</option>
                          {activeProductObj.variants.map((v, idx) => (
                            <option key={idx} value={v.name}>{v.name}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 pointer-events-none text-on-surface-variant">expand_more</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="text-on-surface-variant font-label-sm font-medium opacity-50">{t.color}</label>
                      <input disabled className="bg-surface border border-outline/20 p-3 rounded-lg outline-none cursor-not-allowed opacity-50 text-sm" placeholder="No variants" />
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="flex flex-col gap-2">
                    <label className="text-on-surface-variant font-label-sm font-medium">{t.quantity}</label>
                    <input 
                      name="quantity"
                      value={currentItem.quantity}
                      onChange={handleItemChange}
                      className="bg-surface border border-outline/20 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
                      placeholder={t.quantityPlaceholder}
                      type="number"
                      min="1"
                    />
                  </div>

                  <div className="md:col-span-3 mt-2 flex justify-end">
                    <button 
                      type="button" 
                      onClick={handleAddToCart}
                      className="bg-[#2E7D32] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#1B5E20] transition-colors active:scale-95 text-sm flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      {t.addToList}
                    </button>
                  </div>
                </div>
              </div>


              <h3 className="font-bold text-lg mb-4 text-[#1565C0] border-b pb-2">2. Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-on-surface-variant font-label-sm font-medium">{t.name} <span className="text-primary">*</span></label>
                  <input 
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder={t.namePlaceholder}
                    type="text"
                    required
                  />
                </div>
                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-on-surface-variant font-label-sm font-medium">{t.phone} <span className="text-primary">*</span></label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder="9876543210" 
                    maxLength={10}
                    type="tel"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City/Village */}
                <div className="flex flex-col gap-2">
                  <label className="text-on-surface-variant font-label-sm font-medium">{t.city} <span className="text-primary">*</span></label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder={t.cityPlaceholder}
                    type="text"
                  />
                </div>
                {/* Delivery Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-on-surface-variant font-label-sm font-medium">{t.address} <span className="text-primary">*</span></label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder={t.addressPlaceholder}
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant font-label-sm font-medium">{t.requirements}</label>
                <textarea 
                  name="special_req"
                  value={formData.special_req}
                  onChange={handleChange}
                  className="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
                  placeholder={t.requirementsPlaceholder}
                  rows="3"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-outline/10 mt-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#E8650A] text-white font-bold px-12 py-4 rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-lg group cursor-pointer"
                >
                  {loading ? t.processing : t.submitBtn}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Sidebar / Side Panel */}
        <aside className="lg:col-span-4 space-y-gutter select-none">
          
          {/* Selected Products Dashboard */}
          <div className="bg-surface-container border border-primary/20 p-5 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            <h3 className="font-headline-md text-base text-primary mb-4 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">dashboard</span>
              {t.selectedItems}
            </h3>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-6 bg-white rounded-lg border border-outline/10 border-dashed">
                  <span className="material-symbols-outlined text-3xl text-outline-variant mb-2">remove_shopping_cart</span>
                  <p className="text-on-surface-variant text-sm">{t.emptyCart}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-outline/10 flex justify-between items-center group relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="pl-2">
                      <p className="font-bold text-sm text-on-surface leading-tight">{item.product_name}</p>
                      <div className="flex gap-2 mt-1">
                        {item.sub_type && <span className="text-[10px] bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant font-semibold">{item.sub_type}</span>}
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-outline-variant hover:text-error transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10 cursor-pointer"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="pt-3 border-t border-outline/10 flex justify-between items-center text-sm font-bold">
              <span className="text-on-surface-variant">{t.totalItems}:</span>
              <span className="bg-primary text-white px-2 py-0.5 rounded-full">{cart.length}</span>
            </div>
          </div>

          {/* Contact Support Card */}
          <div className="bg-surface-container border border-surface-variant/30 p-card-padding rounded-xl shadow-sm overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-headline-md text-headline-md text-primary mb-2 font-semibold">{t.needHelp}</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed">{t.helpSub}</p>
              <div className="space-y-3">
                <a className="flex items-center gap-4 p-3 bg-surface rounded-lg hover:shadow-md transition-shadow group" href="tel:+918400936290">
                  <span className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full text-white">
                    <span className="material-symbols-outlined">call</span>
                  </span>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-sm">{t.callUs}</p>
                    <p className="font-bold text-on-surface">+91 84009 36290</p>
                  </div>
                </a>
                <a className="flex items-center gap-4 p-3 bg-[#25D366] text-white rounded-lg hover:shadow-md transition-all scale-100 active:scale-95" href="https://wa.me/917905978260" target="_blank" rel="noreferrer">
                  <span className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  </span>
                  <div>
                    <p className="text-xs font-label-sm opacity-90">{t.waSupport}</p>
                    <p className="font-bold">{t.chatSpecialist}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
}
