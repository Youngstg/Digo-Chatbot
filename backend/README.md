# Digo Chatbot Backend (NestJS + TypeScript) 🤖

Backend REST API & Webhook Service untuk **Digo AI Sales Assistant** yang telah direfactor dari Laravel ke **NestJS**.

---

## 🚀 Teknologi Utama

- **Framework:** NestJS (Node.js v24+ / Express)
- **Bahasa:** TypeScript
- **Database & ORM:** MySQL + Prisma ORM
- **AI Engine:** Google Gen AI SDK (`@google/genai`) dengan *Multi-Model Fallback* & *Cooldown Rate Limit*
- **Background Queue:** BullMQ (didukung Redis untuk Ubuntu / production, dengan fallback in-memory untuk dev lokal)
- **Integrasi Multi-Channel:**
  - Web Chat API
  - Telegram Bot API Webhook
  - Meta WhatsApp Cloud API Webhook

---

## 📁 Struktur Direktori

```
src/
├── main.ts                           # Entry point aplikasi (port, CORS, prefix /api)
├── app.module.ts                     # Root Module
├── app.controller.ts                 # Root info & /api/health check
├── prisma/
│   ├── prisma.service.ts             # Koneksi Database Prisma
│   └── prisma.module.ts              # Global Prisma Module
├── prompts/
│   └── sales-assistant.prompt.ts     # System Prompt persona Digo AI
└── modules/
    ├── gemini/                       # GeminiService (SDK @google/genai + Fallback)
    ├── conversation/                 # Conversation & Message History Service
    ├── knowledge-base/               # Knowledge Base & Service context retrieval (CRUD)
    ├── leads/                        # Leads capture & status update
    ├── chat/                         # Web Chat Widget controller & service
    ├── queue/                        # BullMQ + Redis / In-memory queue processor
    ├── telegram/                     # Telegram Bot Webhook & command handler (/start, /clear, /end, /help)
    └── whatsapp/                     # WhatsApp Cloud API & Fonnte webhook handlers
```

---

## ⚙️ Konfigurasi Environment (`.env`)

Buat atau sesuaikan file `.env` di folder `backend/`:

```env
PORT=8000
DATABASE_URL="mysql://root:password@127.0.0.1:3306/chatbot_llm"
FRONTEND_URL="http://localhost:5173"

# Gemini AI (Google Gen AI SDK)
GEMINI_API_KEY="isi_dengan_gemini_api_key"
GEMINI_MODEL="gemini-2.5-flash"
GEMINI_FALLBACK_1="gemini-2.0-flash"
GEMINI_FALLBACK_2="gemini-1.5-flash"

# Telegram Bot
TELEGRAM_BOT_TOKEN="isi_dengan_token_bot_telegram"

# WhatsApp Cloud API (Meta)
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_VERIFY_TOKEN="digo_webhook_secret"
WHATSAPP_API_VERSION="v18.0"

# Fonnte (Alternatif WhatsApp Gateway)
FONNTE_TOKEN=""

# Redis (Untuk BullMQ di Ubuntu / Production)
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_PASSWORD=""
```

---

## 🛠️ Menjalankan di Lokal (Windows)

1. **Install dependensi (sudah terinstal):**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Sinkronisasi Database (Jika membuat tabel baru):**
   ```bash
   npm run prisma:migrate
   ```

4. **Jalankan Mode Pengembangan:**
   ```bash
   npm run dev
   # Server berjalan di http://localhost:8000/api
   ```

---

## 🐧 Panduan Deploy ke Ubuntu (Production)

Saat mendeploy ke server Ubuntu:

1. **Install Node.js 22/24 & Redis:**
   ```bash
   # Install Redis server
   sudo apt update
   sudo apt install -y redis-server
   sudo systemctl enable --now redis-server

   # Cek status Redis
   redis-cli ping # Menghasilkan: PONG
   ```

2. **Setup Project di Ubuntu:**
   ```bash
   cd backend
   npm install --production=false --legacy-peer-deps
   npm run prisma:generate
   npm run build
   ```

3. **Jalankan dengan Process Manager (PM2):**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/main.js --name digo-backend
   pm2 save
   pm2 startup
   ```

---

## 📡 Daftar Endpoint API

Semua endpoint diawali dengan prefix `/api`:

| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Cek status database, cache, dan Gemini model |
| `POST` | `/api/chat` | Web Chat Widget (AI conversation) |
| `GET` | `/api/knowledge-base` | Ambil semua daftar Knowledge Base |
| `POST` | `/api/knowledge-base` | Tambah entry Knowledge Base baru |
| `PUT` | `/api/knowledge-base/:id` | Update data Knowledge Base |
| `DELETE` | `/api/knowledge-base/:id` | Hapus data Knowledge Base |
| `GET` | `/api/leads` | Ambil data Leads / Calon Pelanggan |
| `POST` | `/api/leads` | Simpan data Lead baru |
| `PUT` | `/api/leads/:id` | Update status Lead (`new`, `contacted`, `qualified`, `closed`) |
| `POST` | `/api/webhook/telegram` | Webhook pesan masuk Telegram Bot |
| `POST` | `/api/webhook/telegram/set` | Daftarkan URL Webhook ke Telegram |
| `POST` | `/api/webhook/telegram/delete` | Hapus Webhook Telegram |
| `GET` | `/api/webhook/whatsapp` | Verifikasi Meta Webhook (Hub Challenge) |
| `POST` | `/api/webhook/whatsapp` | Webhook pesan masuk Meta WhatsApp Cloud API |
