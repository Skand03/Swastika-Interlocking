export const translations = {
  en: {
    // Navbar
    home: 'Home',
    services: 'Services',
    about: 'About Us',
    process: 'Process',
    products: 'Products',
    contact: 'Contact',
    bookOrder: 'Book Order',
    portal: 'Portal Login',
    dashboard: 'Dashboard',
    logout: 'Logout',
    // Auth page
    login: 'Sign In',
    loginHindi: 'Login करें',
    phoneLabel: 'Phone Number',
    passwordLabel: 'Password',
    // Customer Dashboard
    profile: 'Profile',
    orders: 'Orders',
    orderDetails: 'Order Details',
    notifications: 'Notifications',
    reviews: 'Reviews',
    support: 'Support',
    myProfile: 'My Profile',
    // Generic UI strings
    premium: 'Premium Quality',
    timely: 'Timely Delivery',
    bestPrice: 'Best Market Price',
    // ... add more as needed
  },
  hi: {
    // Navbar
    home: 'मुख्य पृष्ठ',
    services: 'सेवाएं',
    about: 'हमारे बारे में',
    process: 'प्रक्रिया',
    products: 'उत्पाद',
    contact: 'संपर्क',
    bookOrder: 'ऑर्डर बुक करें',
    portal: 'पोर्टल लॉगिन',
    dashboard: 'डैशबोर्ड',
    logout: 'लॉगआउट',
    // Auth page
    login: 'Login करें',
    loginHindi: 'Login करें',
    phoneLabel: 'फोन नंबर',
    passwordLabel: 'पासवर्ड',
    // Customer Dashboard
    profile: 'प्रोफ़ाइल',
    orders: 'आदेश',
    orderDetails: 'ऑर्डर विवरण',
    notifications: 'सूचनाएं',
    reviews: 'समीक्षाएं',
    support: 'सहायता',
    myProfile: 'मेरी प्रोफाइल',
    // Generic UI strings
    premium: 'प्रीमियम गुणवत्ता',
    timely: 'समय पर डिलीवरी',
    bestPrice: 'सर्वोत्तम बाजार मूल्य',
    // ... add more as needed
  },
};

export const getTranslations = (lang) => translations[lang];
export const t = (lang, key) => translations[lang]?.[key] ?? translations.en[key] ?? '';
