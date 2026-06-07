import React, { useState, useEffect, useRef } from 'react';

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
  
  const chatEndRef = useRef(null);
  const t = TRANSLATIONS[language];

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
        body: JSON.stringify({ message: userMessage.text })
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
      <div class="fixed bottom-6 right-6 flex flex-col sm:flex-row items-end sm:items-center gap-3 z-50 pointer-events-none select-none">
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/919876543210" 
          target="_blank" 
          rel="noreferrer"
          class="bg-secondary text-on-secondary rounded-full p-4 pointer-events-auto shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer"
        >
          <span class="material-symbols-outlined text-2xl">chat</span>
          <span class="hidden md:inline font-label-sm text-label-sm pr-1">{t.whatsappText}</span>
        </a>

        {/* Chatbot Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          class="bg-primary text-on-primary rounded-full p-4 pointer-events-auto shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer"
        >
          <span class="material-symbols-outlined text-2xl">
            {isOpen ? 'close' : 'smart_toy'}
          </span>
          <span class="hidden md:inline font-label-sm text-label-sm pr-1">
            {isOpen ? t.closeChat : t.botTitle}
          </span>
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div class="fixed bottom-24 right-6 w-[360px] max-w-[90vw] bg-surface rounded-2xl chat-shadow overflow-hidden z-[70] border border-surface-variant/40 flex flex-col h-[500px] transition-all duration-300">
          {/* Header */}
          <div class="bg-primary p-4 flex items-center justify-between text-white select-none">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <h3 class="font-bold text-sm leading-tight">{t.header}</h3>
                <p class="text-[10px] text-white/80">{t.status}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              class="text-white/80 hover:text-white cursor-pointer"
              aria-label="Close Chat"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div class="flex-grow p-4 overflow-y-auto space-y-4 bg-surface-container-low">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                class={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  class={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
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
              <div class="flex justify-start">
                <div class="bg-surface border border-outline-variant/30 text-on-surface rounded-2xl rounded-tl-none p-3 text-sm flex items-center gap-1.5 shadow-sm">
                  <span class="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce"></span>
                  <span class="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span class="w-2 h-2 bg-on-surface/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Footer */}
          <form onSubmit={handleSendMessage} class="p-3 border-t border-surface-variant/30 bg-surface flex items-center gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              class="flex-grow bg-surface-container border border-outline/20 p-2.5 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <button 
              type="submit" 
              class="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-lg leading-none">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
