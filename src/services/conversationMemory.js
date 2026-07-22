/**
 * KAINORA AI - CONVERSATION MEMORY
 * Multi-layer conversation memory with localStorage persistence
 */

const MAX_SHORT_TERM = 20;
const STORAGE_KEY = 'kainora_memory';
const SESSION_KEY = 'kainora_session';

class ConversationMemory {
  constructor() {
    this.shortTerm = [];
    this.longTerm = [];
    this.isInitialized = false;
    this.sessionId = null;
  }

  async init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.longTerm = JSON.parse(saved);
      }

      let session = localStorage.getItem(SESSION_KEY);
      if (!session) {
        session = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(SESSION_KEY, session);
      }
      this.sessionId = session;

      this.isInitialized = true;
      console.log('[Memory] Initialized with', this.longTerm.length, 'long-term messages');
    } catch (error) {
      console.error('[Memory] Init failed:', error);
      this.isInitialized = true;
    }
  }

  async addMessage(role, content, metadata = {}) {
    if (!this.isInitialized) {
      await this.init();
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      metadata,
      timestamp: Date.now()
    };

    this.shortTerm.push(message);

    if (this.shortTerm.length > MAX_SHORT_TERM) {
      this.shortTerm = this.shortTerm.slice(-MAX_SHORT_TERM);
    }

    if (this.shortTerm.length % 5 === 0) {
      this.persistLongTerm();
    }

    return message;
  }

  getHistoryForLLM() {
    return this.shortTerm.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));
  }

  persistLongTerm() {
    try {
      this.longTerm = this.shortTerm.slice(-20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.longTerm));
    } catch (error) {
      console.error('[Memory] Persist failed:', error);
    }
  }

  async clearSession() {
    this.shortTerm = [];
    const newSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, newSession);
    this.sessionId = newSession;
  }

  async clearAll() {
    this.shortTerm = [];
    this.longTerm = [];
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  getMemoryContext() {
    const recent = this.shortTerm.slice(-5);
    return {
      lastIntent: recent.find(m => m.metadata?.intent)?.metadata?.intent || 'unknown',
      turnCount: this.shortTerm.filter(m => m.role === 'user').length,
      totalMessages: this.shortTerm.length
    };
  }
}

export const conversationMemory = new ConversationMemory();
export default conversationMemory;
