/**
 * KAINORA AI - CLOUD AI SERVICE
 * Multi-provider AI dengan automatic fallback
 * 13 FREE AI Providers: Groq, DeepSeek, OpenRouter, Mistral, Fireworks, Cohere, HuggingFace, Perplexity, Novita AI, Cerebras, Lepton, Ollama Cloud, Hyperbolic
 */

import { conversationMemory } from './conversationMemory';
import { KAINORA_SYSTEM_PROMPT } from '../prompts/kainoraPrompts';

// ============================================
// CONFIGURATION - 13 FREE AI PROVIDERS (NO GEMINI)
// ============================================

const AI_PROVIDERS = [
  // TIER 1: Fast & Unlimited (Priority 1-3)
  {
    name: 'Groq',
    priority: 1,
    enabled: true,
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'VITE_GROQ_API_KEY',
    model: 'llama-3.1-8b-instant',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'DeepSeek',
    priority: 2,
    enabled: true,
    baseUrl: 'https://api.deepseek.com',
    apiKeyEnv: 'VITE_DEEPSEEK_API_KEY',
    model: 'deepseek-chat',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'Lepton',
    priority: 3,
    enabled: true,
    baseUrl: 'https://api.lepton.ai/api/v1',
    apiKeyEnv: 'VITE_LEPTON_API_KEY',
    model: 'llama-3.1-70b',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },

  // TIER 2: Free Tier (Priority 4-8)
  {
    name: 'OpenRouter',
    priority: 4,
    enabled: true,
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'VITE_OPENROUTER_API_KEY',
    model: 'microsoft/phi-3-medium-128k-instruct:free',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'Mistral',
    priority: 5,
    enabled: true,
    baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'VITE_MISTRAL_API_KEY',
    model: 'mistral-small-latest',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'Fireworks',
    priority: 6,
    enabled: true,
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    apiKeyEnv: 'VITE_FIREWORKS_API_KEY',
    model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'Cohere',
    priority: 7,
    enabled: true,
    baseUrl: 'https://api.cohere.ai/v1',
    apiKeyEnv: 'VITE_COHERE_API_KEY',
    model: 'command-r-plus',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'HuggingFace',
    priority: 8,
    enabled: true,
    baseUrl: 'https://api-inference.huggingface.co/v1',
    apiKeyEnv: 'VITE_HUGGINGFACE_API_KEY',
    model: 'meta-llama/Llama-3.2-3B-Instruct',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },

  // TIER 3: Additional Free Tier (Priority 9-13)
  {
    name: 'Perplexity',
    priority: 9,
    enabled: true,
    baseUrl: 'https://api.perplexity.ai',
    apiKeyEnv: 'VITE_PERPLEXITY_API_KEY',
    model: 'sonar',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'NovitaAI',
    priority: 10,
    enabled: true,
    baseUrl: 'https://api.novita.ai/v3',
    apiKeyEnv: 'VITE_NOVITAAI_API_KEY',
    model: 'llama-3.1-8b-instruct',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'Cerebras',
    priority: 11,
    enabled: true,
    baseUrl: 'https://api.cerebras.ai/v1',
    apiKeyEnv: 'VITE_CEREBRAS_API_KEY',
    model: 'llama-3.3-70b',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'OllamaCloud',
    priority: 12,
    enabled: true,
    baseUrl: 'https://api.ollama.ai/v1',
    apiKeyEnv: 'VITE_OLLAMA_CLOUD_API_KEY',
    model: 'llama3.2',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },
  {
    name: 'Hyperbolic',
    priority: 13,
    enabled: true,
    baseUrl: 'https://api.hyperbolic.xyz/v1',
    apiKeyEnv: 'VITE_HYPERBOLIC_API_KEY',
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    maxTokens: 250,
    temperature: 0.6,
    topP: 0.9,
    errorCodes: [429, 500, 502, 503, 504],
    supportsStreaming: true,
  },

  // ❌ Gemini REMOVED - tidak dipakai lagi
];

// Response cache for identical queries
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================
// UTILITY FUNCTIONS
// ============================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getApiKey = (envKey) => {
  // Try Vite env
  const value = import.meta.env[envKey];
  // Return key if it exists and is not empty
  return value && value !== '' && value !== 'undefined' ? value : null;
};

const generateCacheKey = (messages) => {
  const lastMsg = messages[messages.length - 1]?.content || '';
  return `${lastMsg.slice(0, 100)}_${messages.length}`;
};

// ============================================
// PROVIDER IMPLEMENTATIONS
// ============================================

class CloudAIService {
  constructor() {
    this.currentProvider = null;
    this.lastError = null;
    this.providerStats = {};

    // Initialize stats
    AI_PROVIDERS.forEach(p => {
      this.providerStats[p.name] = { attempts: 0, successes: 0, failures: 0 };
    });
  }

  /**
   * Get available provider (sorted by priority)
   */
  getAvailableProviders() {
    return AI_PROVIDERS
      .filter(p => p.enabled && getApiKey(p.apiKeyEnv))
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check if any provider is configured
   */
  isConfigured() {
    return this.getAvailableProviders().length > 0;
  }

  /**
   * Health check - test each provider
   */
  async healthCheck() {
    const results = [];

    for (const provider of AI_PROVIDERS) {
      const apiKey = getApiKey(provider.apiKeyEnv);
      if (!apiKey) continue;

      try {
        const isHealthy = await this.testProvider(provider, apiKey);
        results.push({
          name: provider.name,
          isAvailable: isHealthy,
          apiKeyPresent: true,
          model: provider.model
        });
      } catch (error) {
        results.push({
          name: provider.name,
          isAvailable: false,
          apiKeyPresent: true,
          error: error.message
        });
      }
    }

    const hasWorking = results.some(r => r.isAvailable);
    const workingProviders = results.filter(r => r.isAvailable).map(r => r.name);

    return {
      status: hasWorking ? 'healthy' : 'unconfigured',
      providers: results,
      isAvailable: hasWorking,
      primaryProvider: results.find(r => r.isAvailable)?.name || null,
      workingProviders
    };
  }

  /**
   * Test a specific provider with a simple request
   */
  async testProvider(provider, apiKey) {
    try {
      let response;

      if (provider.name === 'HuggingFace') {
        response = await fetch(`${provider.baseUrl}/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [{ role: 'user', content: 'Hi' }],
            max_tokens: 10
          })
        });
      } else {
        // Standard OpenAI-like API test
        response = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [{ role: 'user', content: 'Hi' }],
            max_tokens: 5
          })
        });
      }

      return response?.ok || false;
    } catch {
      return false;
    }
  }

  /**
   * Main chat function with automatic fallback
   */
  async chat(messages, options = {}) {
    const {
      temperature = 0.6,
      maxTokens = 250,
      stream = false
    } = options;

    // Check cache first (for non-streaming)
    if (!stream) {
      const cacheKey = generateCacheKey(messages);
      const cached = responseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('[CloudAI] Using cached response');
        return cached.content;
      }
    }

    // Try each provider in priority order
    const providers = this.getAvailableProviders();

    if (providers.length === 0) {
      throw new Error('Tidak ada provider AI yang dikonfigurasi. Tambahkan API key di .env.local');
    }

    let lastError = null;

    for (const provider of providers) {
      const apiKey = getApiKey(provider.apiKeyEnv);
      this.providerStats[provider.name].attempts++;

      try {
        console.log(`[CloudAI] Trying ${provider.name}...`);

        const response = await this.callProvider(provider, apiKey, messages, {
          temperature,
          maxTokens: Math.min(maxTokens, provider.maxTokens),
          stream
        });

        this.providerStats[provider.name].successes++;
        this.currentProvider = provider.name;

        // Cache non-streaming responses
        if (!stream && response) {
          responseCache.set(generateCacheKey(messages), {
            content: response,
            timestamp: Date.now(),
            provider: provider.name
          });
        }

        console.log(`[CloudAI] ✅ ${provider.name} berhasil!`);
        return response;

      } catch (error) {
        console.warn(`[CloudAI] ❌ ${provider.name} gagal:`, error.message);
        this.providerStats[provider.name].failures++;
        lastError = error;

        // If it's a rate limit, wait a bit before trying next
        if (provider.errorCodes.includes(error.status)) {
          await sleep(1000);
        }

        continue; // Try next provider
      }
    }

    // All providers failed
    this.lastError = lastError;
    throw lastError || new Error('Semua provider AI gagal');
  }

  /**
   * Call specific AI provider
   */
  async callProvider(provider, apiKey, messages, options) {
    const { name } = provider;

    // All providers are now OpenAI-compatible
    return this.callOpenAICompatible(provider, apiKey, messages, options);
  }

  /**
   * Call OpenAI-compatible API
   */
  async callOpenAICompatible(provider, apiKey, messages, options) {
    const { temperature, maxTokens, stream } = options;

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        top_p: provider.topP || 0.9,
        stream: stream && provider.supportsStreaming
      }),
      signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const err = new Error(error.error?.message || `${provider.name} error: ${response.status}`);
      err.status = response.status;
      throw err;
    }

    if (stream && provider.supportsStreaming) {
      return this.handleStreamResponse(response);
    }

    const data = await response.json();

    // Handle different response formats
    return data.choices?.[0]?.message?.content ||
           data.choices?.[0]?.text ||
           data.output ||
           '';
  }

  /**
   * Handle streaming response
   */
  async *handleStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() && (line.startsWith('data: ') || line.startsWith('{'))) {
            const data = line.startsWith('data: ') ? line.slice(6) : line;
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Build messages for AI with context
   */
  buildMessages(userInput, context = {}) {
    const { productContext = '', postContext = '', intent = 'unknown' } = context;

    // Get conversation history
    const history = conversationMemory.getHistoryForLLM();

    // System message with context
    let systemMessage = KAINORA_SYSTEM_PROMPT;

    if (productContext || postContext) {
      systemMessage += '\n\n=== DATA DARI DATABASE WEBSITE ===\n';
      systemMessage += productContext;
      systemMessage += postContext;
      systemMessage += '\n\nWAJIB: Gunakan data di atas untuk menjawab!';
    }

    // Build messages array
    const messages = [
      { role: 'system', content: systemMessage },
      ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userInput }
    ];

    return messages;
  }

  /**
   * Get current provider stats
   */
  getStats() {
    return {
      currentProvider: this.currentProvider,
      stats: this.providerStats,
      cacheSize: responseCache.size
    };
  }
}

// Singleton instance
export const cloudAIService = new CloudAIService();
export default cloudAIService;
