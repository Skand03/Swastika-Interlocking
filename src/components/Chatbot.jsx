import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const TRANSLATIONS = {
  hi: {
    header: 'स्वस्तिका सहायक',
    status: 'ऑनलाइन',
    welcome: 'नमस्ते! स्वस्तिका इंटरलॉकिंग में आपका स्वागत है। मैं आपकी सहायता के लिए यहाँ हूँ। आप मुझसे हमारे उत्पादों, कीमतों या ऑर्डर बुकिंग के बारे में पूछ सकते हैं।',
    placeholder: 'मुझसे कुछ पूछें...',
    errorMsg: 'कनेक्शन में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    typing: 'टाइप कर रहा है...',
    whatsappText: 'WhatsApp',
    botTitle: 'AI Assistant',
    closeChat: 'Close Chat'
  },
  en: {
    header: 'Swastika Assistant',
    status: 'Online',
    welcome: 'Hello! Welcome to Swastika Interlocking. I am here to assist you. You can ask me about our products, pricing, or order booking.',
    placeholder: 'Ask me something...',
    errorMsg: 'Connection error. Please try again.',
    typing: 'Typing...',
    whatsappText: 'WhatsApp',
    botTitle: 'AI Assistant',
    closeChat: 'Close Chat'
  }
};

export default function Chatbot({ language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDialOpen, setIsDialOpen] = useState(false);
  
  const chatEndRef = useRef(null);
  const t = TRANSLATIONS[language];

  const { dbUser } = useAuth();
  const userName = dbUser ? dbUser.full_name : '';
  const userPhone = dbUser ? dbUser.phone : '';
  
  let waText = "Hello Swastika Interlocking, I would like to know more about your products.";
  if (userName && userPhone) {
    waText = `Hello Swastika Interlocking,\nMy name is ${userName} (Phone: ${userPhone}).\nI would like to know more about your products.`;
  } else if (userName) {
    waText = `Hello Swastika Interlocking,\nMy name is ${userName}.\nI would like to know more about your products.`;
  }
  
  const waUrl = `https://wa.me/917905978260?text=${encodeURIComponent(waText)}`;

  // Set initial welcome message when language changes or on load
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: TRANSLATIONS[language].welcome
      }
    ]);
  }, [language]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('./api/chat.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          name: userName,
          phone: userPhone
        })
      });
      
      const result = await response.json();
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: result.response || (language === 'hi' ? 'माफ़ कीजिये, मैं समझ नहीं पाया।' : "Sorry, I didn't quite catch that.")
          }
        ]);
        setIsTyping(false);
      }, 600);

    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: t.errorMsg
          }
        ]);
        setIsTyping(false);
      }, 600);
    }
  };

  return (
    <>
      {/* Floating Toggle Buttons (Bottom Actions) */}
      <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 flex flex-col items-center gap-3 z-50 pointer-events-none select-none">
        <div className={`flex flex-col items-center gap-3 transition-all duration-300 origin-bottom ${isDialOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4 pointer-events-none'}`}>
          {/* WhatsApp Button */}
          <a 
            href={waUrl} 
            target="_blank" 
            rel="noreferrer"
            className="bg-[#1b6d24] text-white w-12 h-12 md:w-14 md:h-14 shrink-0 pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(27,109,36,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group relative"
            style={{ borderRadius: '50%' }}
            aria-label="WhatsApp"
          >
            <span className="material-symbols-outlined text-[20px] md:text-2xl">chat</span>
          </a>

          {/* Chatbot Toggle Button */}
          <button 
            onClick={() => { setIsOpen(true); setIsDialOpen(false); }}
            className="bg-[#9b4000] text-white w-12 h-12 md:w-14 md:h-14 shrink-0 pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(155,64,0,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group relative"
            style={{ borderRadius: '50%' }}
            aria-label="AI Assistant"
          >
            <span className="material-symbols-outlined text-[20px] md:text-2xl">
              smart_toy
            </span>
          </button>
        </div>

        {/* Master Dial Toggle Button */}
        <button 
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              setIsDialOpen(!isDialOpen);
            }
          }}
          className="bg-primary text-on-primary w-12 h-12 md:w-14 md:h-14 shrink-0 pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer z-50"
          style={{ borderRadius: '50%' }}
          aria-label="Toggle Menu"
        >
          <span className={`material-symbols-outlined text-[24px] md:text-3xl transition-transform duration-300 ${isDialOpen ? 'rotate-180' : ''} ${isOpen ? 'rotate-45' : ''}`}>
            {isOpen ? 'close' : 'keyboard_arrow_up'}
          </span>
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] max-w-[90vw] bg-surface rounded-2xl chat-shadow overflow-hidden z-[70] border border-surface-variant/40 flex flex-col h-[500px] transition-all duration-300">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">{t.header}</h3>
                <p className="text-[10px] text-white/80">{t.status}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white cursor-pointer"
              aria-label="Close Chat"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-surface-container-low">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface border border-outline-variant/30 text-on-surface rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface border border-outline-variant/30 text-on-surface rounded-2xl rounded-tl-none p-3 text-sm flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-variant/30 bg-surface flex items-center gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              className="flex-grow bg-surface-container border border-outline/20 p-2.5 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <button 
              type="submit" 
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg leading-none">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
