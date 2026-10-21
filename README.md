<div align="center">
  <img src="frontend/public/image/Logo_only.png" alt="Digo Chatbot Logo" width="160" />

  # 🤖 Digo — AI Sales Assistant for Digital Agencies

  <p align="center">
    <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel" alt="Laravel" />
    <img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php" alt="PHP" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Google%20Gemini-Flash%20%26%20Gemma-4285F4?style=for-the-badge&logo=google" alt="Gemini" />
    <img src="https://img.shields.io/badge/Channels-Telegram%20%7C%20WhatsApp%20%7C%20Web-25D366?style=for-the-badge" alt="Channels" />
  </p>

  <p align="center">
    <strong>Asisten Penjualan Cerdas Berbasis Generative AI & RAG untuk Menjawab Pertanyaan Klien, Menjelaskan Layanan Agensi, dan Mengonversi Prospek Secara Otomatis 24/7.</strong>
  </p>

  <p align="center">
    🌐 <strong>Live Demo:</strong> <a href="https://digo.us.ci" target="_blank">https://digo.us.ci</a>
  </p>
</div>

---

## 💡 Gambaran Solusi

Dalam industri agensi digital, merespon prospek secara cepat (*speed-to-lead*) adalah kunci keberhasilan konversi penjualan. Namun, staf penjualan manusia tidak dapat siaga 24 jam sehari, sementara calon klien sering kali membutuhkan informasi detail mengenai paket harga, portofolio, dan estimasi waktu pengerjaan di luar jam kerja.

**Digo hadir sebagai representasi AI sales consultant:**
* Melayani konsultasi interaktif secara alami, ramah, dan solutif.
* Mengambil konteks data layanan secara akurat menggunakan pendekatan **Retrieval-Augmented Generation (RAG)**.
* Terhubung langsung ke channel komunikasi terpopuler klien: **Web Chat Widget**, **Telegram Bot**, dan **WhatsApp**.

---

## ✨ Fitur Unggulan

### 1. 🌐 Multi-Channel Omnichannel Integration
* **Modern Web Widget:** Antarmuka obrolan web modern dibangun dengan React 19 dan Tailwind CSS v4.
* **Telegram Bot Gateway:** Integrasi webhook dua arah dengan dukungan perintah `/start`, `/clear`, `/help`, dan `/end`.
* **WhatsApp Cloud & Fonnte Gateway:** Komunikasi langsung ke nomor WhatsApp calon klien dengan penanganan pesan masuk otomatis.

### 2. 🧠 Contextual RAG (Retrieval-Augmented Generation)
* Sebelum mengirim prompt ke LLM, sistem secara otomatis menelusuri database **Services**, **Pricing Packages**, **Case Studies**, dan **FAQ** yang relevan dengan pertanyaan calon klien.
* Menghilangkan risiko *halusinasi* harga atau klaim layanan yang tidak ada.

### 3. 🔄 Gemini Auto-Fallback System (High Availability)
Sistem memiliki mekanisme mitigasi batas kuota (Rate-Limit / HTTP 429) otomatis dengan perputaran model berjenjang:
1. **Tier 1:** `gemini-2.5-flash` (Respon tercepat dan terpadat)
2. **Tier 2:** `gemini-3.1-flash-lite` (Fallback kuota tinggi)
3. **Tier 3:** `gemma-4-27b-it` (Fallback model terbuka)
*Setiap model yang mengalami limitasi otomatis masuk ke masa istirahat (cooldown) dengan status termonitor di endpoint `/api/health`.*

### 4. ⚡ Asynchronous Queue Architecture & Anti-Spam
* Pemrosesan LLM dieksekusi secara asinkron di background melalui **Laravel Database Queue** untuk mencegah timeout pada webhook Telegram/WhatsApp.
* **Deduplication Filter:** Mencegah balasan ganda terhadap pesan webhook yang dikirim ulang oleh server Meta/Telegram.

---

## 🏗️ Arsitektur Sistem

```
[ Klien: Web / Telegram / WhatsApp ]
                 │
                 ▼
     [ Nginx Reverse Proxy (SSL) ]
        ├── /       ──> [ React 19 Frontend SPA (Vite Dist) ]
        └── /api/*  ──> [ Laravel 12 Backend API (PHP-FPM) ]
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [ MySQL 8 Storage ]           [ Background Queue Worker ]
        ├── Knowledge Base                     │
        ├── Chat Histories                     ▼
        └── Leads Management          [ Gemini AI Multi-Model ]
                                         ├── Context Retrieval
                                         └── Dynamic Prompting
```

---

## 🛠️ Tech Stack

* **Backend Framework:** [Laravel 12](https://laravel.com/) (PHP 8.3)
* **Frontend Widget:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
* **AI & LLM Services:** Google Gemini API (Gemini Flash & Gemma), Custom RAG Service
* **Database & Cache:** MySQL 8.0, Redis / Database Queue Driver
* **Messaging APIs:** Telegram Bot API, Meta WhatsApp Cloud API / Fonnte Gateway
* **Deployment & CI/CD:** Ubuntu Linux, Nginx, PHP-FPM 8.3, GitHub Actions CI/CD Pipeline

---

## 📄 Lisensi

Dikembangkan sebagai solusi otomatisasi penjualan cerdas untuk agensi digital modern.  
© 2026 **Digo AI Assistant**. Seluruh hak cipta dilindungi.
