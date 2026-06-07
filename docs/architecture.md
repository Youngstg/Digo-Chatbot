# Sistem Arsitektur AI Sales Assistant

Dokumen ini menjelaskan alur data, arsitektur teknis, dan mekanisme penanganan beban (rate limiting & fallback) dari sistem chatbot Digo.

---

## 🏗️ Alur Komunikasi Sistem

Sistem mendukung tiga gerbang masuk (Web Chat, Telegram Bot, dan WhatsApp Gateway) yang semuanya dilayani oleh satu backend Laravel yang terpusat.

```mermaid
graph TD
    subgraph Frontend / Channels
        A[Web Chat Widget]
        B[Telegram Bot]
        C[WhatsApp Cloud API]
        D[Fonnte Gateway]
    end

    subgraph Laravel Backend
        E[API Controllers]
        F[(MySQL Database)]
        G[Queue Worker / Jobs]
        H[Knowledge Base Retriever]
    end

    subgraph AI Engine
        I[Gemini 2.5 Flash]
        J[Gemini 3.1 Flash Lite]
        K[Gemma 4 27B]
    end

    A -->|Direct HTTP POST| E
    B -->|Webhook| E
    C -->|Webhook| E
    D -->|Webhook| E

    E -->|Write Chat History| F
    E -->|Dispatch to Queue| G
    G -->|Retrieve Context| H
    H -->|Query Service/FAQ| F
    G -->|Request Chat| I
    I -->|If 429 / Timeout| J
    J -->|If 429 / Timeout| K
    G -->|Update Chat History| F
    G -->|Send Reply| B
    G -->|Send Reply| C
    G -->|Send Reply| D
```

---

## 🔄 Alur Kerja Pemrosesan Pesan (Asinkron)

Untuk mencegah timeout pada WhatsApp dan Telegram Bot, pemrosesan AI dijalankan secara asinkron menggunakan Laravel Queue Worker.

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna (Telegram/WA)
    participant Platform as Telegram/WhatsApp Server
    participant Laravel as Laravel Controller
    participant DB as Database
    participant Queue as Queue Worker (Job)
    participant Gemini as Gemini API

    User->>Platform: Kirim Pesan ("Berapa harga website?")
    Platform->>Laravel: HTTP POST Webhook Payload
    Note over Laravel: Deduplikasi menggunakan update_id / message_id
    Laravel->>DB: Catat riwayat chat user
    Laravel->>Queue: Dispatch ProcessTelegramMessage Job
    Laravel-->>Platform: HTTP 200 OK (Respons Cepat)
    Note over Platform: Koneksi ditutup (Cegah Retry/Spam)

    Queue->>Laravel: Jalankan Job di Background
    Queue->>Platform: Kirim "typing..." Action
    Queue->>DB: Cari Context di Knowledge Base & Service
    DB-->>Queue: Return Context (Layanan, Harga, FAQ)
    Queue->>Gemini: Kirim Prompt (System Prompt + Context + History)
    Gemini-->>Queue: Return Jawaban (Teks Bersih)
    Queue->>DB: Catat jawaban Digo ke database
    Queue->>Platform: Kirim balasan ke User
    Platform->>User: Terima Pesan dari Digo
```

---

## 🧠 Sistem Auto-Fallback Gemini

Untuk mengatasi limit kuota harian (Requests Per Day - RPD) pada Google AI Studio Free Tier, `GeminiService` menggunakan mekanisme **Fallback Chain** otomatis menggunakan Cache Driver:

1. **Model Utama (Primary):** `gemini-2.5-flash` (kualitas terbaik, 20 RPD).
2. **Fallback Pertama:** `gemini-3.1-flash-lite` (500 RPD).
3. **Fallback Kedua:** `gemma-4-27b-it` (1500 RPD).

### Mekanisme Cooldown
Jika sebuah model mengembalikan kode status HTTP `429` (Rate Limited) atau `503` (Service Unavailable):
1. Sistem menandai model tersebut di Cache dengan status `cooldown` selama **1 jam**.
2. Sistem secara otomatis berpindah ke model fallback berikutnya untuk melayani request saat ini.
3. Selama masa cooldown aktif, model tersebut akan dilewati (skipped) saat ada chat baru masuk.
