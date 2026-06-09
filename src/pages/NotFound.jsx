import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound({ language }) {
  const isHi = language === 'hi';
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center select-none pt-24 animate-fade-in">
      <div className="relative">
        <h1 className="text-9xl md:text-[150px] font-black text-outline/10 tracking-tighter select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-primary animate-bounce-once" style={{fontVariationSettings: "'FILL' 1"}}>
            construction
          </span>
        </div>
      </div>
      
      <h2 className="font-headline-md text-2xl md:text-3xl text-on-surface mt-4 mb-2 font-bold">
        {isHi ? 'पेज नहीं मिला' : 'Page Not Found'}
      </h2>
      
      <p className="text-on-surface-variant max-w-md mb-8">
        {isHi 
          ? 'क्षमा करें, आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।' 
          : 'Sorry, the page you are looking for doesn\'t exist or has been moved.'}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/" 
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-container hover:-translate-y-1 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">home</span>
          {isHi ? 'होम पेज पर जाएँ' : 'Go to Home'}
        </Link>
        <Link 
          to="/products" 
          className="bg-surface text-primary border-2 border-primary/20 px-8 py-3 rounded-full font-bold hover:border-primary active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">category</span>
          {isHi ? 'उत्पाद देखें' : 'View Products'}
        </Link>
      </div>
    </div>
  );
}
