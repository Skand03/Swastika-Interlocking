import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    title: 'बुक आर्डर / Book Your Order',
    sub: 'अटूट नींव के लिए प्रीमियम इंटरलॉकिंग पेवर्स। कोटेशन और डिलीवरी शेड्यूल के लिए नीचे विवरण भरें।',
    requiredErr: 'कृपया सभी आवश्यक क्षेत्रों (*) को भरें।',
    name: 'नाम / Name',
    namePlaceholder: 'पूरा नाम दर्ज करें',
    phone: 'फ़ोन / Phone Number',
    city: 'शहर या गाँव / City or Village',
    cityPlaceholder: 'स्थान दर्ज करें',
    product: 'उत्पाद का प्रकार / Product Type',
    selectProduct: 'उत्पाद चुनें',
    quantity: 'मात्रा / Quantity (वर्ग फीट)',
    quantityPlaceholder: 'उदा. 500',
    address: 'डिलिवरी का पता / Delivery Address',
    addressPlaceholder: 'लैंडमार्क के साथ पूरा पता दर्ज करें',
    requirements: 'विशेष आवश्यकताएं / Special Requirements',
    requirementsPlaceholder: 'कोई विशेष रंग, मोटाई या समय निर्देश?',
    submitBtn: 'ऑर्डर सबमिट करें / Submit Order',
    processing: 'प्रक्रिया में है...',
    successMsg: 'आपका ऑर्डर बुकिंग अनुरोध सफलतापूर्वक दर्ज कर लिया गया है! ऑर्डर आईडी: ',
    successMsgEnd: '। हम पुष्टि के लिए जल्द ही आपसे संपर्क करेंगे।',
    failMsg: 'ऑर्डर बुकिंग में समस्या आई। कृपया पुनः प्रयास करें।',
    connErr: 'सर्वर से कनेक्ट करने में विफलता। कृपया इंटरनेट कनेक्शन या स्थानीय XAMPP सर्वर जांचें।',
    instructions: 'निर्देश / Instructions',
    inst1: 'स्थापना क्षेत्र की सटीक माप सुनिश्चित करें।',
    inst2: 'ड्राइववे और भारी वाहनों के लिए हेवी ड्यूटी ब्लॉक की सिफारिश की जाती है।',
    inst3: 'ऑर्डर की पुष्टि के बाद सामान्य तौर पर डिलीवरी में 3-5 कार्य दिवस लगते हैं।',
    needHelp: 'सहायता चाहिए? / Need Help?',
    helpSub: 'मात्रा और उत्पाद चयन पर मार्गदर्शन के लिए हमारे उत्पाद विशेषज्ञ से बात करें।',
    callUs: 'कॉल करें',
    waSupport: 'WhatsApp सहायता',
    chatSpecialist: 'विशेषज्ञ से चैट करें',
    productsList: [
      { value: 'Paver Blocks', label: 'इंटरलॉकिंग पेवर ब्लॉक (Paver Blocks)' },
      { value: 'Cement', label: 'सीमेंट (Cement Grade 53)' },
      { value: 'River Sand', label: 'नदी की रेत (River Sand)' },
      { value: 'Crushed Stone', label: 'कुचला हुआ पत्थर (Crushed Stone)' },
      { value: 'Drainage Pipes', label: 'निकासी पाइप (Drainage Pipes)' },
      { value: 'Hollow Blocks', label: 'खोखले ब्लॉक (Hollow Blocks)' },
      { value: 'I-Shape Pavers', label: 'I-Shape Interlocking (Heavy Duty)' },
      { value: 'Zig-Zag Pavers', label: 'Zig-Zag Pavers (Standard)' },
      { value: 'Trihex Blocks', label: 'Trihex Blocks (Landscaping)' },
      { value: 'Uni-Paver', label: 'Uni-Paver (Commercial)' }
    ]
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
    product: 'Product Type',
    selectProduct: 'Select Product',
    quantity: 'Quantity (Sq. Ft.)',
    quantityPlaceholder: 'e.g. 500',
    address: 'Delivery Address',
    addressPlaceholder: 'Full address with landmark',
    requirements: 'Special Requirements',
    requirementsPlaceholder: 'Any specific color, thickness, or timing instructions?',
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
    productsList: [
      { value: 'Paver Blocks', label: 'Interlocking Paver Blocks' },
      { value: 'Cement', label: 'Cement (Grade 53)' },
      { value: 'River Sand', label: 'River Sand (Washed)' },
      { value: 'Crushed Stone', label: 'Crushed Stone (Gravel)' },
      { value: 'Drainage Pipes', label: 'Drainage Pipes' },
      { value: 'Hollow Blocks', label: 'Hollow Blocks' },
      { value: 'I-Shape Pavers', label: 'I-Shape Interlocking (Heavy Duty)' },
      { value: 'Zig-Zag Pavers', label: 'Zig-Zag Pavers (Standard)' },
      { value: 'Trihex Blocks', label: 'Trihex Blocks (Landscaping)' },
      { value: 'Uni-Paver', label: 'Uni-Paver (Commercial)' }
    ]
  }
};

export default function Order({ language }) {
  const location = useLocation();
  const t = TRANSLATIONS[language];
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    city: '',
    product_type: '',
    quantity: '',
    address: '',
    special_req: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (location.state && location.state.selectedProduct) {
      setFormData(prev => ({
        ...prev,
        product_type: location.state.selectedProduct
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.phone || !formData.product_type || !formData.quantity || !formData.address) {
      setStatusMsg(t.requiredErr);
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setStatusMsg('');

    try {
      const response = await fetch('./api/submit_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setStatusMsg(t.successMsg + result.order_id + t.successMsgEnd);
        setFormData({
          customer_name: '',
          phone: '',
          city: '',
          product_type: '',
          quantity: '',
          address: '',
          special_req: ''
        });
      } else {
        setIsSuccess(false);
        setStatusMsg(result.message || t.failMsg);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setStatusMsg(t.connErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main class="pt-32 pb-20 px-gutter max-w-container-max mx-auto min-h-screen">
      {/* Page Header */}
      <div class="mb-12 text-center md:text-left select-none">
        <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">{t.title}</h1>
        <p class="text-on-surface-variant max-w-2xl leading-relaxed">{t.sub}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Order Form Section */}
        <section class="lg:col-span-8">
          <div class="bg-surface-container-low p-card-padding rounded-xl border border-surface-variant/30 shadow-sm transition-all duration-300">
            {statusMsg && (
              <div class={`p-4 rounded-lg mb-6 text-sm font-medium ${isSuccess ? 'bg-secondary/20 text-secondary-fixed-dim border border-secondary/30' : 'bg-error-container text-on-error-container border border-error/30'}`}>
                {statusMsg}
              </div>
            )}
            
            <form onSubmit={handleSubmit} class="space-y-6" id="orderForm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div class="flex flex-col gap-2">
                  <label class="text-on-surface-variant font-label-sm font-medium">{t.name} <span class="text-primary">*</span></label>
                  <input 
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    class="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder={t.namePlaceholder}
                    type="text"
                    required
                  />
                </div>
                {/* Phone Number */}
                <div class="flex flex-col gap-2">
                  <label class="text-on-surface-variant font-label-sm font-medium">{t.phone} <span class="text-primary">*</span></label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    class="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder="+91 00000 00000" 
                    type="tel"
                    required
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City/Village */}
                <div class="flex flex-col gap-2">
                  <label class="text-on-surface-variant font-label-sm font-medium">{t.city} <span class="text-primary">*</span></label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    class="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder={t.cityPlaceholder}
                    type="text"
                    required
                  />
                </div>
                {/* Product Type */}
                <div class="flex flex-col gap-2">
                  <label class="text-on-surface-variant font-label-sm font-medium">{t.product} <span class="text-primary">*</span></label>
                  <div class="relative flex items-center">
                    <select 
                      name="product_type"
                      value={formData.product_type}
                      onChange={handleChange}
                      class="w-full bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer text-sm"
                      required
                    >
                      <option value="" disabled>{t.selectProduct}</option>
                      {t.productsList.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <span class="material-symbols-outlined absolute right-4 pointer-events-none text-on-surface-variant">arrow_drop_down</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quantity */}
                <div class="md:col-span-1 flex flex-col gap-2">
                  <label class="text-on-surface-variant font-label-sm font-medium">{t.quantity} <span class="text-primary">*</span></label>
                  <input 
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    class="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder={t.quantityPlaceholder}
                    type="number"
                    min="1"
                    required
                  />
                </div>
                {/* Delivery Address */}
                <div class="md:col-span-2 flex flex-col gap-2">
                  <label class="text-on-surface-variant font-label-sm font-medium">{t.address} <span class="text-primary">*</span></label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    class="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder={t.addressPlaceholder}
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div class="flex flex-col gap-2">
                <label class="text-on-surface-variant font-label-sm font-medium">{t.requirements}</label>
                <textarea 
                  name="special_req"
                  value={formData.special_req}
                  onChange={handleChange}
                  class="bg-surface border border-outline/20 p-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
                  placeholder={t.requirementsPlaceholder}
                  rows="4"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div class="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  class="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary font-bold px-12 py-4 rounded-lg hover:bg-primary-container transition-all active:scale-95 shadow-lg group cursor-pointer"
                >
                  {loading ? t.processing : t.submitBtn}
                  <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Sidebar / Side Panel */}
        <aside class="lg:col-span-4 space-y-gutter select-none">
          {/* Instruction Card */}
          <div class="bg-surface-container-high p-card-padding rounded-xl border border-surface-variant/30 shadow-sm">
            <h3 class="font-headline-md text-headline-md text-primary mb-4 font-semibold">{t.instructions}</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-1 select-none">check_circle</span>
                <span class="text-body-md leading-relaxed">{t.inst1}</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-1 select-none">check_circle</span>
                <span class="text-body-md leading-relaxed">{t.inst2}</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-1 select-none">check_circle</span>
                <span class="text-body-md leading-relaxed">{t.inst3}</span>
              </li>
            </ul>
          </div>

          {/* Contact Support Card */}
          <div class="bg-surface-container border border-surface-variant/30 p-card-padding rounded-xl shadow-sm overflow-hidden relative">
            <div class="relative z-10">
              <h3 class="font-headline-md text-headline-md text-primary mb-2 font-semibold">{t.needHelp}</h3>
              <p class="text-on-surface-variant mb-6 leading-relaxed">{t.helpSub}</p>
              <div class="space-y-3">
                <a class="flex items-center gap-4 p-3 bg-surface rounded-lg hover:shadow-md transition-shadow group" href="tel:+919876543210">
                  <span class="w-10 h-10 flex items-center justify-center bg-secondary rounded-full text-white">
                    <span class="material-symbols-outlined">call</span>
                  </span>
                  <div>
                    <p class="text-xs text-on-surface-variant font-label-sm">{t.callUs}</p>
                    <p class="font-bold text-on-surface">+91 98765 43210</p>
                  </div>
                </a>
                <a class="flex items-center gap-4 p-3 bg-[#25D366] text-white rounded-lg hover:shadow-md transition-all scale-100 active:scale-95" href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                  <span class="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">
                    <span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  </span>
                  <div>
                    <p class="text-xs font-label-sm opacity-90">{t.waSupport}</p>
                    <p class="font-bold">{t.chatSpecialist}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Visual Anchor */}
          <div class="rounded-xl overflow-hidden aspect-[4/3] relative group shadow-sm">
            <img 
              alt="Premium Pavers Paving" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7LtFJAYD-egm6zF-lK0iZfFiXLv4lxUKlYYIbbpBgsY0vv3-k4xGPS-HH0YJiG_ca8XxctYdJwCOG_3mn_WeeB0sFqijEdDiKpNyA-288waHSJjsPqSngmXdvr5hcXPqg6UxYIMMNY0G_l9reAKTpvrtd0fmf26VVXRSHJAYXXKefJUS2aEsfBHFJ6fyqD5-FPubyEx5lH8Zm9AQASPL5jcyWdQkS9xA8MmgHArhHOGByZelpAA-izyib27V4XGgPVGgyTagjlJk" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-6 text-white animate-fade-in">
              <p class="font-bold text-lg">Heavy Duty Engineering</p>
              <p class="text-sm opacity-90">Built for a lifetime of durability.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
