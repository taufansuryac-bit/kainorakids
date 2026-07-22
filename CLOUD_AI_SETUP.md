# 🚀 KAINORA AI - Cloud AI Setup Guide

## ✅ Perubahan dari Ollama ke Cloud AI

**SEBELUM:**
- ❌ Ollama running di PC
- ❌ Cloudflare Tunnel untuk expose
- ❌ GitHub Pages dengan CSP conflict

**SESUDAH:**
- ✅ 13 Cloud AI Providers (Gratis!)
- ❌ Gemini DIBUANG (unreliable, replaced)
- ✅ No local server needed
- ✅ Auto-fallback kalau satu provider down
- ✅ Website bisa jalan dari mana aja

---

## 📋 Daftar 13 AI Provider Gratis (NO GEMINI!)

### ⚡ TIER 1: Fast & Unlimited

| # | Provider | Limit | Daftar |
|---|----------|-------|--------|
| 1 | **Groq** ⭐ | 30 req/min | [console.groq.com](https://console.groq.com) |
| 2 | **DeepSeek** | 60 req/min | [platform.deepseek.com](https://platform.deepseek.com) |
| 3 | **Lepton** | Unlimited | [lepton.ai](https://www.lepton.ai) |

### 🔄 TIER 2: Free Tier

| # | Provider | Limit | Daftar |
|---|----------|-------|--------|
| 4 | **OpenRouter** | $1/day | [openrouter.ai](https://openrouter.ai) |
| 5 | **Mistral** | Free tier | [console.mistral.ai](https://console.mistral.ai) |
| 6 | **Fireworks AI** | Free tier | [fireworks.ai](https://fireworks.ai) |
| 7 | **Cohere** | Free tier | [cohere.com](https://cohere.com) |
| 8 | **HuggingFace** | Rate limited | [huggingface.co](https://huggingface.co) |

### 📱 TIER 3: Additional Free

| # | Provider | Limit | Daftar |
|---|----------|-------|--------|
| 9 | **Perplexity** | Free | [perplexity.ai](https://perplexity.ai) |
| 10 | **Novita AI** | Free | [novita.ai](https://novita.ai) |
| 11 | **Cerebras** | Free | [cerebras.ai](https://cerebras.ai) |
| 12 | **Ollama Cloud** | Free | [ollama.ai/cloud](https://ollama.ai/cloud) |
| 13 | **Hyperbolic** | Free | [hyperbolic.ai](https://hyperbolic.ai) |

### ❌ GEMINI: REMOVED
- Gemini gratis terlalu unreliable
- Sering error "server sibuk"
- Diganti 13 provider lain yang lebih reliable

---

## 🛠️ Setup Langkah demi Langkah

### 1. Daftar API Keys (Cukup 2-3 Aja!)

**Wajib (Daftar Sekarang):**
```
1. Groq       → https://console.groq.com        (30 req/min)
2. DeepSeek   → https://platform.deepseek.com   (60 req/min)
```

**Opsional (Tambah kalau mau):**
```
3. OpenRouter → https://openrouter.ai          ($1/day)
4. Mistral    → https://console.mistral.ai      (Free)
```

### 2. Buat File .env.local

```bash
# Di folder kainorakids-web
copy .env.example .env.local
```

### 3. Isi API Keys

Edit file `.env.local`:
```env
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxx
VITE_DEEPSEEK_API_KEY=xxxxxxxxxxxxxxxxxxxx
# VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
```

### 4. Restart Dev Server

```bash
npm run dev
```

---

## 🎯 Cara Kerja Auto-Fallback

```
User tanya →
  1️⃣ Groq (priority 1)
     ✅ Berhasil → Balas!
     ❌ Gagal (rate limit/error) →
       2️⃣ DeepSeek (priority 2)
         ✅ Berhasil → Balas!
         ❌ Gagal →
           3️⃣ Lepton (priority 3)
             ✅ Berhasil → Balas!
             ❌ Gagal →
               ... 13 provider ...
                 ❌ Semua gagal ->
                   ❌ "Maaf, semua server sibuk"
```

---

## 🧪 Test

1. Buka website
2. Klik tombol "TANYA KAINORA"
3. Lihat status di header chat:
   - 🟢 ONLINE (Groq) = Groq aktif
   - 🟢 ONLINE (DeepSeek) = DeepSeek aktif
   - 🔴 OFFLINE = Belum ada API key configured

---

## 💰 Estimate Biaya

| Provider | Free Limit | Monthly Cost |
|----------|-----------|--------------|
| Groq | 30 req/min | **GRATIS** ✅ |
| DeepSeek | 60 req/min | **GRATIS** ✅ |
| OpenRouter | $1/day | **GRATIS** ✅ |

Untuk Kainora Kids: **SEMPURNA GRATIS** ✅✅✅

---

## 🔧 Troubleshooting

### Error: "Tidak ada provider AI yang dikonfigurasi"
→ Pastikan `.env.local` sudah dibuat dan API key sudah di-set

### Error: "Server sedang sibuk"
→ Normal kalau rate limit tercapai. Otomatis retry atau fallback ke provider lain.

### Website lambat
→ Groq adalah yang fastest. Pastikan Groq di-set sebagai primary.

---

## 📁 File yang Berubah

```
✅ src/services/cloudAIService.js       - 13 AI providers (NO GEMINI)
✅ src/services/conversationMemory.js   - Memory system
✅ src/hooks/useAIHealth.js            - Health check
✅ src/prompts/kainoraPrompts.js       - System prompt
✅ src/components/KainoraAI.jsx        - Chat UI
✅ .env.example                       - Template API keys
✅ CLOUD_AI_SETUP.md                 - Panduan ini

❌ src/services/ollamaService.js     - Dihapus
❌ src/hooks/useOllamaHealth.js     - Dihapus
❌ VITE_GEMINI_API_KEY              - DIBUANG!
```

---

## 🎉 Selamat!

Kamu sekarang punya 13 AI providers (tanpa Gemini) yang bisa fallback otomatis!
- Website lebih reliable
- Tidak tergantung PC local
- AI bisa jalan 24/7
- Cost = $0 (GRATIS!)

Happy coding! 🚀
