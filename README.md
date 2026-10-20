# 🌟 KAINORA KIDS - Premium Indonesian Kids Clothing

Website e-commerce baju anak premium Indonesia dengan Cloud AI (13 provider gratis) untuk customer service otomatis.

## ✨ Features

- 🛍️ **E-commerce Lengkap**: Keranjang, checkout, wishlist, review
- 🤖 **KAINORA AI (MIMIN)**: Customer service AI dengan 13 cloud AI provider + auto-fallback
- 📱 **Responsive Design**: Mobile-first, brutalist style
- ⚡ **Performance**: Code splitting, lazy loading, optimized builds
- 🔒 **Security Hardened**: All env vars protected, gitignore strict

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router 6
- **Styling**: Tailwind CSS
- **AI**: 13 Cloud AI Providers (Groq, DeepSeek, OpenRouter, dll)
- **State**: Context API
- **Backend**: Firebase (optional)

## 🛠️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:
```bash
copy .env.example .env.local
```

Edit `.env.local` dan isi API keys (minimal 2-3):
```env
VITE_GROQ_API_KEY=gsk_xxxxx
VITE_DEEPSEEK_API_KEY=sk-xxxxx
```

Daftar di:
- Groq: https://console.groq.com
- DeepSeek: https://platform.deepseek.com
- OpenRouter: https://openrouter.ai

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 📋 Scripts

- `npm run dev` - Development server (http://localhost:5173)
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤖 AI Providers (13 Total)

Priority order dengan auto-fallback:
1. Groq (30 req/min)
2. DeepSeek (60 req/min)
3. Lepton (Unlimited)
4. OpenRouter ($1/day)
5. Mistral (Free tier)
6. Fireworks AI (Free)
7. Cohere (Free)
8. HuggingFace (Rate limited)
9. Perplexity (Free)
10. Novita AI (Free)
11. Cerebras (Free)
12. Ollama Cloud (Free)
13. Hyperbolic (Free)

Lihat detail di [CLOUD_AI_SETUP.md](docs/CLOUD_AI_SETUP.md)

## 🔒 Security

- `.env.local` di-gitignore (TIDAK akan ke-upload)
- Firebase keys: JANGAN pernah hardcode di file JS
- API key sensitive hanya di environment variables

## 📄 License

Private - KAINORA Kids © 2026

## Desain
Sistem desain neo-brutalist (token, papan catur, tipografi kinetik): lihat [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
