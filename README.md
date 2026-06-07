# AI Sales Assistant for Digital Agency - Digo 🤖

AI Sales Assistant (Digo) adalah chatbot berbasis Large Language Model (LLM) yang dirancang untuk membantu calon pelanggan memahami layanan digital agency secara interaktif, natural, dan asinkron.

Aplikasi ini mengintegrasikan **Laravel 12** sebagai backend controller & business logic dengan **React (Vite + Tailwind CSS v4)** sebagai widget chat web, serta mendukung integrasi webhook instan ke **Telegram Bot** dan **WhatsApp Gateway**.

---

## 🚀 Fitur Utama (Progress Saat Ini)

### 1. Multi-Channel Chatbot
* **Web Chat Widget:** Antarmuka web modern dengan Tailwind CSS v4 yang interaktif.
* **Telegram Bot Integration:** Mendukung command `/start`, `/clear`, `/end`, dan `/help`.
* **WhatsApp Gateway:** Terintegrasi dengan Meta WhatsApp Cloud API serta opsi gateway lokal via **Fonnte**.

### 2. AI & Context Retrieval (RAG MVP)
* **Contextual Knowledge Retrieval:** Sistem mencari informasi yang relevan dari database Layanan, Harga, Fitur, dan FAQ sebelum mengirimkannya ke AI.
* **Persona Digo:** Persona asisten penjualan yang ramah, profesional, ringkas, dan fokus menggali kebutuhan klien tanpa memaksa.
* **Clean Text Formatting:** Penyaringan teks otomatis untuk membersihkan simbol markdown (bintang ganda, dsb.) menjadi teks natural ramah platform pesan.

### 3. Sistem Antrean & Anti-Spam (Asinkron)
* **Laravel Database Queue:** Pemrosesan AI dilakukan di background agar Telegram/WhatsApp tidak timeout.
* **Deduplication Filter:** Mengabaikan request ganda dengan ID yang sama dari webhook Telegram/Meta.
* **Instant 200 OK Reply:** Mengirim sinyal terima cepat ke server pengirim untuk menghindari spam pengiriman ulang dari platform.

### 4. Sistem Auto-Fallback Gemini (Anti-Limit)
Sistem memiliki pengalihan model otomatis menggunakan Cache Driver jika kuota harian model utama habis:
1. `gemini-2.5-flash` (Primary - 20 RPD)
2. `gemini-3.1-flash-lite` (Fallback 1 - 500 RPD)
3. `gemma-4-27b-it` (Fallback 2 - 1.5K RPD)
*Setiap model yang terkena rate limit (HTTP 429/503) akan masuk masa cooldown selama 1 jam.*

---

## 📁 Struktur Folder Proyek

```
D:\chatbot_llm\
├── docs/                           # Dokumentasi Proyek
│   ├── api.md                      # Spesifikasi REST API & Webhook
│   ├── database.md                 # Desain Database & Tabel MySQL
│   └── architecture.md             # Alur Data & Fallback System
│
├── backend/                        # Backend API (Laravel 12)
│   ├── app/Http/Controllers/Api/   # Controllers (Chat, Lead, KB, Webhooks)
│   ├── app/Jobs/                   # Background Processing (ProcessTelegramMessage)
│   ├── app/Models/                 # Eloquent Models (Service, Lead, Message, dll)
│   ├── app/Repositories/           # Data Access Layer
│   ├── app/Services/               # Core Logic (Gemini, Telegram, WhatsApp, KB)
│   ├── app/Prompts/                # AI Prompt Template (SalesAssistantPrompt)
│   ├── config/                     # Konfigurasi CORS & Third-party Services
│   └── database/                   # Migrations & Seeders
│
└── frontend/                       # Frontend Web (React + Vite + Tailwind v4)
    ├── src/components/             # ChatWidget, LeadForm, UI Reusable
    ├── src/hooks/                  # useChat custom hook
    ├── src/pages/                  # ChatPage (Web Widget), AdminPage (Leads)
    ├── src/services/               # API call layer (Axios)
    └── src/store/                  # Chat Context State
```

---

## 🛠️ Cara Memulai & Instalasi

### Prasyarat
* PHP >= 8.2
* Node.js >= 20.18 (Vite 5 terpasang untuk kompatibilitas)
* Composer
* MySQL Database

### 1. Setup Backend (Laravel)

1. Masuk ke folder backend dan install dependensi:
   ```bash
   cd backend
   composer install
   ```
2. Salin file `.env.example` menjadi `.env` dan konfigurasikan database Anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=chatbot_llm
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
3. Tambahkan konfigurasi API key di `.env` (Google AI Studio & Platform Token):
   ```env
   # Gemini AI API Key
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   GEMINI_FALLBACK_1=gemini-3.1-flash-lite
   GEMINI_FALLBACK_2=gemma-4-27b-it
   
   # Telegram
   TELEGRAM_BOT_TOKEN=123456:ABC...

   # WhatsApp Fonnte
   FONNTE_TOKEN=your_fonnte_token
   ```
4. Jalankan migrasi database dan isi dengan data contoh (Seeder):
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

### 2. Setup Frontend (React)

1. Masuk ke folder frontend dan install dependensi:
   ```bash
   cd ../frontend
   npm install
   ```
2. Jalankan server pembangunan lokal frontend:
   ```bash
   npm run dev
   ```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi membutuhkan tiga proses berjalan bersamaan agar fitur Webhook asinkron berjalan mulus di localhost:

### 1. Jalankan API Server (Terminal 1)
```bash
cd backend
php artisan serve
```

### 2. Jalankan Queue Worker (Terminal 2)
```bash
cd backend
php artisan queue:work --timeout=90
```

### 3. Jalankan ngrok tunnel (Terminal 3)
```bash
ngrok http 8000
```
*Gunakan URL HTTPS publik ngrok untuk mendaftarkan webhook di Telegram BotFather (`/setWebhook`) atau di Dashboard Fonnte/Meta.*

---

## 💬 Perintah Bot Telegram yang Tersedia
* `/start` - Memulai percakapan baru dan mereset riwayat chat sesi ini.
* `/clear` - Menghapus seluruh riwayat percakapan untuk memulai topik baru.
* `/end` - Mengakhiri sesi chat saat ini dengan pesan perpisahan yang ramah.
* `/help` - Menampilkan daftar perintah yang tersedia.

---

## 📄 Dokumentasi Tambahan
* Lengkapnya mengenai Route API: [Dokumentasi API](docs/api.md)
* Struktur Database & Tabel: [Dokumentasi Database](docs/database.md)
* Alur Detail Sistem: [Dokumentasi Arsitektur](docs/architecture.md)
