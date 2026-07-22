import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Terminal, Send, X, Bot, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAIHealth } from '../hooks/useAIHealth';
import { cloudAIService } from '../services/cloudAIService';
import { conversationMemory } from '../services/conversationMemory';
import { KAINORA_SYSTEM_PROMPT } from '../prompts/kainoraPrompts';

// --- SALES PSYCHOLOGY ARRAYS ---
const CONVERSATIONAL_OPENERS = [
  "Halo Bunda! Senang banget bisa ngobrol sama Bunda hari ini. ",
  "Hai Bun! Wah, paham banget deh rasanya. ",
  "Halo Bunda kesayangan! Pas banget Bunda nanya ini. ",
  "Wah, menarik nih pertanyaannya Bun! KAINORA bantu ya. "
];

const SOFT_SELL_CLOSINGS = [
  "Daripada penasaran, Bunda bisa cek dulu detail gemasnya di bawah ini ya!",
  "Boleh banget klik kartu di bawah ini untuk intip pilihan warnanya.",
  "Mumpung stoknya masih aman, yuk intip sebentar detailnya di bawah ini Bun!"
];

const KAINORA_GREETINGS = {
  firstTime: [
    "Hai Bunda! 👋 Mimin KAINORA siap bantu. Mau cari baju anak atau baca tips parenting?",
    "Welcome! ✨ Mimin KAINORA, asisten Kainora Kids. Ada yang bisa dibantu?"
  ],
  returning: [
    "Bunda balik lagi! 🥰 Mimin kangen nih! Ada yang dicari?",
    "Welcome back! 💃 Mimin siap bantu yang mana kali ini?"
  ],
  loyal: [
    "🔥🔥🔥 VIP CUSTOMER! Mimin salute! Mau lihat koleksi terbaru?",
    "Bunda favorit balik! 💎 Mimin siap maximal service!"
  ]
};

const POSITIVE_PATTERNS = [
  /lucu|lhat|manis|gemes|imut|cantik|suka|love/i,
  /bagus|keren|oke|mantap|sip|best|sempurna/i,
  /terima kasih|makasih|thanks/i
];

const NEGATIVE_PATTERNS = [
  /mahal|berat|rugi/i,
  /jelek|buruk|kecewa|sayang|takut|ragu/i,
  /lama|lemot|slow/i
];

const SUGGESTED_QUESTIONS = {
  product: [
    "Baju apa yang lagi trend? 👗",
    "Rekomendasiin baju untuk anak 2 tahun",
    "Baju cowok yang adem apa ya?"
  ],
  blog: [
    "Tips memilih baju anak",
    "Cara merawat baju katun"
  ],
  default: [
    "Lihat koleksi terbaru",
    "Bantu saya pilih kado",
    "Baju terlaris apa?"
  ]
};

const CONVERSATION_STAGES = {
  AWARENESS: 'awareness',
  INTEREST: 'interest',
  CONSIDERATION: 'consideration',
  INTENT: 'intent',
  CONVERSION: 'conversion',
  CLOSING: 'closing'
};

const KainoraAI = () => {
  const { posts, products } = useStore();
  const aiHealth = useAIHealth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const [chatContext, setChatContext] = useState({
    lastIntent: 'unknown',
    forcedContext: null
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const visits = localStorage.getItem('kainora_visits') || '0';
      const lastVisit = localStorage.getItem('kainora_last_visit');
      return {
        visits: parseInt(visits),
        lastVisit,
        isReturning: parseInt(visits) > 0,
        isLoyal: parseInt(visits) >= 5
      };
    } catch {
      return { visits: 0, lastVisit: null, isReturning: false, isLoyal: false };
    }
  });

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const searchCacheRef = useRef(new Map());

  const productFuse = useMemo(() => new Fuse(products || [], {
    keys: ['name', 'category', 'description', 'gender', 'warna', 'bahan'],
    threshold: 0.5,
    ignoreLocation: true,
    includeScore: true
  }), [products]);

  const postFuse = useMemo(() => new Fuse(posts?.length ? posts : [], {
    keys: ['title', 'category', 'excerpt', 'content'],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true
  }), [posts]);

  // Init
  useEffect(() => {
    const initialize = async () => {
      try {
        await conversationMemory.init();
        setIsInitialized(true);
      } catch (error) {
        console.error('[KAINORA] Init error:', error);
        setIsInitialized(true);
      }
    };
    if (isOpen && !isInitialized) {
      initialize();
    }
  }, [isOpen, isInitialized]);

  // Visit tracking
  useEffect(() => {
    if (isOpen) {
      const newVisits = userProfile.visits + 1;
      try {
        localStorage.setItem('kainora_visits', newVisits.toString());
        localStorage.setItem('kainora_last_visit', new Date().toISOString());
      } catch {}
      setUserProfile(prev => ({
        ...prev,
        visits: newVisits,
        isReturning: newVisits > 0,
        isLoyal: newVisits >= 5
      }));
    }
  }, [isOpen]);

  // Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let greeting;
      if (userProfile.isLoyal) {
        greeting = KAINORA_GREETINGS.loyal[Math.floor(Math.random() * KAINORA_GREETINGS.loyal.length)];
      } else if (userProfile.isReturning) {
        greeting = KAINORA_GREETINGS.returning[Math.floor(Math.random() * KAINORA_GREETINGS.returning.length)];
      } else {
        greeting = KAINORA_GREETINGS.firstTime[Math.floor(Math.random() * KAINORA_GREETINGS.firstTime.length)];
      }
      setMessages([{ sender: 'ai', text: greeting }]);
    }
  }, [isOpen, messages.length, userProfile]);

  // Listen for pre-filled chats
  useEffect(() => {
    const handler = (e) => {
      setIsOpen(true);
      if (e.detail?.prompt) setInputValue(e.detail.prompt);
      if (e.detail?.context) {
        setChatContext(prev => ({ ...prev, forcedContext: e.detail.context }));
      }
    };
    window.addEventListener('OPEN_AI_CHAT_WITH_PROMPT', handler);
    return () => window.removeEventListener('OPEN_AI_CHAT_WITH_PROMPT', handler);
  }, []);

  // Esc to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamedText]);

  // Sentiment
  const analyzeSentiment = useCallback((text) => {
    const lowerText = text.toLowerCase();
    const positiveScore = POSITIVE_PATTERNS.filter(p => p.test(lowerText)).length;
    const negativeScore = NEGATIVE_PATTERNS.filter(p => p.test(lowerText)).length;
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }, []);

  // Intent detection
  const detectIntent = useCallback((input) => {
    const lowerInput = input.toLowerCase();
    const stopwords = ['yang', 'di', 'ke', 'dari', 'untuk', 'buat', 'saya', 'aku', 'mau', 'dong', 'ya', 'sih', 'kok', 'ada'];
    const words = lowerInput.match(/\b(\w+)\b/g) || [];
    const searchStr = words.filter(w => !stopwords.includes(w)).join(" ");

    const scores = { product: 0, blog: 0, greeting: 0, thanks: 0, consultation: 0, objection: 0 };

    const intentKeywords = {
      greeting: ['halo', 'hai', 'hy', 'pagi', 'siang', 'sore', 'malam', 'hello'],
      thanks: ['makasih', 'terima kasih', 'thanks', 'sip', 'mantap'],
      product: ['baju', 'kaos', 'celana', 'dress', 'size', 'ukuran', 'harga', 'warna', 'cowok', 'cewek', 'rekomendasi', 'cari', 'beli', 'bahan'],
      blog: ['artikel', 'jurnal', 'tips', 'cara', 'gimana', 'baca', 'anak', 'kesehatan'],
      consultation: ['kado', 'hadiah', 'bingung', 'cocok'],
      objection: ['mahal', 'jelek', 'lama', 'ragu', 'takut']
    };

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      for (const word of keywords) {
        if (searchStr.includes(word) || lowerInput.includes(word)) {
          scores[intent]++;
        }
      }
    }

    const maxEntry = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);
    return { intent: maxEntry[0], score: maxEntry[1], searchStr };
  }, []);

  const cachedSearch = useCallback((query, fuse, cache) => {
    if (cache.has(query)) return cache.get(query);
    const results = fuse.search(query);
    cache.set(query, results);
    return results;
  }, []);

  // Process with Cloud AI
  const processWithAI = useCallback(async (input) => {
    if (!aiHealth.isAvailable) {
      throw new Error('Cloud AI not available');
    }

    const intentResult = detectIntent(input);
    setChatContext(prev => ({ ...prev, lastIntent: intentResult.intent }));

    const history = conversationMemory.getHistoryForLLM();

    let productContext = '';
    let relevantProduct = null;
    let relevantPost = null;

    const productResults = cachedSearch(intentResult.searchStr || input, productFuse, searchCacheRef.current);
    let topProducts = productResults.slice(0, 5).map(r => r.item) || [];

    const postResults = cachedSearch(intentResult.searchStr || input, postFuse, searchCacheRef.current);
    const topPosts = postResults.slice(0, 3).map(r => r.item) || [];

    if (topProducts.length > 0) {
      productContext = '\n\n📦 PRODUK:\n';
      topProducts.forEach((p, i) => {
        productContext += `${i + 1}. ${p.name} - Rp ${p.price?.toLocaleString('id-ID') || 'N/A'}\n`;
        if (p.description) productContext += `   ${p.description}\n`;
      });
      if (['product', 'consultation', 'objection'].includes(intentResult.intent)) {
        relevantProduct = topProducts[0];
      }
    }

    let postContext = '\n📝 ARTIKEL:\n';
    if (chatContext.forcedContext) {
      postContext += `${chatContext.forcedContext}\n`;
    } else if (topPosts.length > 0) {
      topPosts.forEach((p, i) => {
        postContext += `${i + 1}. ${p.title}\n`;
        if (p.excerpt) postContext += `   ${p.excerpt}\n`;
      });
      if (intentResult.intent === 'blog') relevantPost = topPosts[0];
    }

    const systemPrompt = KAINORA_SYSTEM_PROMPT;
    const fullContext = productContext + postContext;
    let promptSuffix = `\n\nPertanyaan: ${input}\n\n📏 Max 3 paragraf, langsung to the point, tambah CTA.`;

    const fullPrompt = `${systemPrompt}\n\nDATA:${fullContext}\n\nWAJIB: Gunakan data di atas!${promptSuffix}`;

    const messages = [
      ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: fullPrompt }
    ];

    setIsTyping(true);
    setStreamedText('');

    try {
      abortControllerRef.current = new AbortController();

      const response = await cloudAIService.chat(messages, {
        temperature: 0.6,
        maxTokens: 250,
        stream: true
      });

      let fullResponse = '';
      for await (const chunk of response) {
        fullResponse += chunk;
        setStreamedText(fullResponse);
      }

      await conversationMemory.addMessage('user', input, { intent: intentResult.intent });
      await conversationMemory.addMessage('assistant', fullResponse, { intent: intentResult.intent });

      return { text: fullResponse, product: relevantProduct, post: relevantPost };
    } catch (error) {
      console.error('[CloudAI] Error:', error);
      throw error;
    } finally {
      setIsTyping(false);
      setStreamedText('');
    }
  }, [aiHealth.isAvailable, detectIntent, cachedSearch, productFuse, postFuse, chatContext.forcedContext]);

  // Rule-based fallback
  const processWithRules = useCallback((input) => {
    const intentResult = detectIntent(input);
    const sentiment = analyzeSentiment(input);

    setChatContext(prev => ({ ...prev, lastIntent: intentResult.intent }));

    if (sentiment === 'positive' && intentResult.intent !== 'greeting') {
      return {
        text: "Seneng banget Bunda suka! 💕 Mimin punya koleksi lain yang juga LUCU LUCU!",
        product: products[Math.floor(Math.random() * products.length)],
        isUpsell: true
      };
    }

    if (intentResult.intent === 'greeting') {
      return "Halo Bunda! Ada yang bisa KAINORA bantu hari ini? ✨";
    }

    if (intentResult.intent === 'thanks') {
      return "Sama-sama Bunda! Senang bisa membantu. Ada lagi yang ingin ditanyakan? 😊";
    }

    const productResults = cachedSearch(intentResult.searchStr, productFuse, searchCacheRef.current);
    const postResults = cachedSearch(intentResult.searchStr, postFuse, searchCacheRef.current);
    const bestProduct = productResults.length > 0 ? productResults[0]?.item : null;
    const bestPost = postResults.length > 0 ? postResults[0]?.item : null;

    if (intentResult.intent === 'product' || (intentResult.intent === 'unknown' && bestProduct)) {
      return {
        text: CONVERSATIONAL_OPENERS[Math.floor(Math.random() * CONVERSATIONAL_OPENERS.length)]
              + SOFT_SELL_CLOSINGS[Math.floor(Math.random() * SOFT_SELL_CLOSINGS.length)],
        product: bestProduct || products[Math.floor(Math.random() * products.length)]
      };
    }

    if (intentResult.intent === 'blog' && bestPost) {
      return {
        text: `Fase ini memang punya tantangannya sendiri ya Bunda. Di Jurnal Kainora, kami punya panduan yang pas:\n\n📝 ${bestPost.title.toUpperCase()}\n\nBunda bisa membaca artikel lengkapnya dengan mengklik kartu di bawah ini. Semangat terus ya Bun!`,
        post: bestPost
      };
    }

    return "Kainora belum punya jawaban untuk itu Bun. Fokus KAINORA AI saat ini adalah seputar katalog baju Kainora dan tips parenting di Jurnal.";
  }, [detectIntent, analyzeSentiment, cachedSearch, productFuse, postFuse, products]);

  // Handle send
  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    try {
      let response;
      if (aiHealth.isAvailable && isInitialized) {
        try {
          response = await processWithAI(userText);
        } catch (error) {
          console.warn('[KAINORA] Cloud AI failed, fallback to rules:', error);
          response = processWithRules(userText);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 600));
        response = processWithRules(userText);
      }

      const newMsg = typeof response === 'string'
        ? { sender: 'ai', text: response }
        : { sender: 'ai', ...response };

      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      console.error('[KAINORA] Error:', err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Maaf Bund, ada gangguan teknis. Coba lagi ya!'
      }]);
    } finally {
      setIsTyping(false);
      setStreamedText('');
    }
  }, [inputValue, aiHealth.isAvailable, isInitialized, processWithAI, processWithRules]);

  const currentSuggestions = SUGGESTED_QUESTIONS[chatContext.lastIntent] || SUGGESTED_QUESTIONS.default;

  return (
    <>
      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#111827] text-amber-500 border-2 border-amber-500 px-4 py-3 shadow-[4px_4px_0_0_rgba(245,158,11,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(245,158,11,1)] transition-all flex items-center gap-2 group"
          aria-label="Open KAINORA AI Chat"
        >
          <Terminal className="w-5 h-5 animate-pulse" />
          <span className="font-mono-tech text-xs font-bold tracking-widest uppercase group-hover:text-[#F9F9F6] flex items-center gap-2">
            [ TANYA KAINORA ]
            {!aiHealth.isChecking && (
              <span className={`text-[9px] px-1.5 py-0.5 border ${aiHealth.isAvailable ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}`}>
                {aiHealth.isAvailable ? 'ONLINE' : 'OFFLINE'}
              </span>
            )}
          </span>
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed top-20 left-4 right-4 bottom-4 sm:inset-6 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:h-[650px] max-h-[85vh] bg-[#111827] border-4 border-amber-500 shadow-[8px_8px_0_0_rgba(245,158,11,1)] z-[9999] flex flex-col font-mono-tech text-[#F9F9F6]">

          {/* HEADER */}
          <div className="flex justify-between items-center bg-amber-500 text-[#111827] p-4 border-b-4 border-amber-500">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-black tracking-widest text-sm uppercase">KAINORA AI</h3>
                <p className="text-[9px] font-bold tracking-widest opacity-80">🤖 MIMIN KAINORA</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {aiHealth.isChecking ? (
                <div className="flex items-center gap-1 bg-[#111827] px-2 py-1 border border-gray-600">
                  <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">CHECKING</span>
                </div>
              ) : aiHealth.isAvailable ? (
                <div className="flex items-center gap-1 bg-[#111827] px-2 py-1 border border-green-500">
                  <span className="text-green-500 text-[10px] animate-pulse">●</span>
                  <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase">
                    {aiHealth.primaryProvider || 'ONLINE'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-[#111827] px-2 py-1 border border-red-500">
                  <span className="text-red-500 text-[10px]">○</span>
                  <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">OFFLINE</span>
                </div>
              )}
              {userProfile.isLoyal && (
                <span className="text-[10px] bg-[#111827] text-amber-500 px-2 py-1 font-bold border border-[#111827]">⭐ VIP</span>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#111827] hover:text-amber-500 transition-colors border-2 border-transparent hover:border-current"
                aria-label="Close chat (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 hide-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 border-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#F9F9F6] text-[#111827] border-[#F9F9F6] rounded-tl-lg rounded-bl-lg rounded-br-lg'
                    : 'bg-transparent text-amber-500 border-amber-500 rounded-tr-lg rounded-br-lg rounded-bl-lg'
                } ${msg.isUpsell ? 'border-amber-400 bg-amber-500/10' : ''}`}>
                  <p className="text-xs leading-relaxed font-bold font-sans whitespace-pre-wrap">{msg.text}</p>
                </div>

                {msg.product && (
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent('OPEN_PRODUCT', { detail: msg.product }));
                    }}
                    className="mt-2 w-[85%] max-w-[250px] bg-[#F9F9F6] border-2 border-[#111827] p-2 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] transition-all"
                  >
                    <img src={msg.product.img} alt={msg.product.name} className="w-full h-32 object-cover border-2 border-[#111827] mb-2 grayscale hover:grayscale-0 transition-all duration-300" />
                    <h4 className="text-[#111827] font-black tracking-widest text-[10px] uppercase">{msg.product.name}</h4>
                    <p className="text-amber-600 font-bold text-xs mt-1">Rp {msg.product.price?.toLocaleString('id-ID') || 'N/A'}</p>
                  </div>
                )}

                {msg.post && (
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent('OPEN_BLOG', { detail: msg.post }));
                    }}
                    className="mt-2 w-[85%] max-w-[250px] bg-[#F9F9F6] border-2 border-[#111827] p-2 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] transition-all"
                  >
                    <img src={msg.post.img} alt={msg.post.title} className="w-full h-24 object-cover border-2 border-[#111827] mb-2 grayscale hover:grayscale-0 transition-all duration-300" />
                    <p className="text-amber-600 font-bold text-[9px] uppercase tracking-widest mb-1">{msg.post.category}</p>
                    <h4 className="text-[#111827] font-black tracking-wider text-[10px] uppercase line-clamp-2">{msg.post.title}</h4>
                  </div>
                )}
              </div>
            ))}

            {streamedText && (
              <div className="flex flex-col items-start">
                <div className="max-w-[85%] p-3 border-2 border-amber-500 bg-transparent text-amber-500 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                  <p className="text-xs leading-relaxed font-bold font-sans whitespace-pre-wrap">
                    {streamedText}
                    <span className="animate-pulse">▌</span>
                  </p>
                </div>
              </div>
            )}

            {isTyping && !streamedText && (
              <div className="flex justify-start">
                <div className="bg-transparent text-amber-500 border-2 border-amber-500 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                  <span className="text-xs font-bold animate-pulse">🤖 MinKai .....</span>
                </div>
              </div>
            )}

            {inputValue === '' && !isTyping && messages.length > 1 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-[10px] text-amber-500/70 font-bold">💡 Saran pertanyaan:</p>
                <div className="flex flex-wrap gap-2">
                  {currentSuggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInputValue(q)}
                      className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-1 border border-amber-500/50 hover:bg-amber-500/40 hover:border-amber-500 transition-all rounded font-bold"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 border-t-4 border-amber-500 bg-[#111827]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="KETIK DI SINI... (Enter untuk kirim, Esc untuk tutup)"
                className="flex-grow bg-transparent border-2 border-amber-500 p-3 text-xs text-[#F9F9F6] placeholder-amber-500/50 focus:outline-none focus:bg-amber-500/10 font-bold tracking-widest"
                aria-label="Chat input"
              />
              <button
                onClick={handleSend}
                className="bg-amber-500 text-[#111827] p-3 border-2 border-amber-500 hover:bg-[#111827] hover:text-amber-500 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-[9px] text-amber-500/50">⌨️ <kbd className="bg-amber-500/20 px-1">Esc</kbd> tutup</p>
              {aiHealth.isAvailable && aiHealth.primaryProvider && (
                <span className="text-[9px] text-green-500">🤖 {aiHealth.primaryProvider}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KainoraAI;
