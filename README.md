<div align="center">
  <img src="frontend/public/image/Logo_only.png" alt="Digo Chatbot Logo" width="180" />

  # AI Sales Assistant for Digital Agency - Digo 🤖

  <p align="center">
    <img src="https://skillicons.dev/icons?i=laravel,php,mysql" alt="Backend Stack" />
    <img src="https://skillicons.dev/icons?i=react,tailwind,vite,js" alt="Frontend Stack" />
  </p>

  <p align="center">
    <strong>Smart AI-Powered Sales Assistant for Digital Agencies</strong>
  </p>

  <p align="center">
    <a href="README.md">🇺🇸 English</a> | <a href="README_IDN.md">🇮🇩 Bahasa Indonesia</a>
  </p>
</div>

---

**AI Sales Assistant (Digo)** is a Large Language Model (LLM) based chatbot designed to help potential clients understand digital agency services interactively, naturally, and asynchronously. This application integrates **Laravel 12** as the *backend controller* with **React (Vite + Tailwind CSS v4)** as the *web chat widget interface*, and supports instant *webhook* integration to **Telegram Bot** and **WhatsApp Gateway**.

---

## 🚀 Key Features (Current Progress)

### 1. Multi-Channel Chatbot
* **Web Chat Widget:** Modern web interface built with Tailwind CSS v4.
* **Telegram Bot Integration:** Supports `/start`, `/clear`, `/end`, and `/help` commands.
* **WhatsApp Gateway:** Integrated with Meta WhatsApp Cloud API and local gateway options via **Fonnte**.

### 2. AI & Context Retrieval (RAG MVP)
* **Contextual Knowledge Retrieval:** The system retrieves relevant information from the Services, Pricing, Features, and FAQ database before sending it to the AI.
* **Digo Persona:** A friendly, professional, and concise sales assistant persona focused on exploring client needs without being pushy.
* **Clean Text Formatting:** Automatic text filtering to clean markdown symbols (double asterisks, etc.) into natural text suitable for messaging platforms.

### 3. Queue System & Anti-Spam (Asynchronous)
* **Laravel Database Queue:** AI processing is done in the background to prevent Telegram/WhatsApp timeouts.
* **Deduplication Filter:** Ignores duplicate requests with the same ID from Telegram/Meta webhooks.
* **Instant 200 OK Reply:** Sends quick acknowledgement signals to the webhook server to prevent retry spam from the platforms.

### 4. Gemini Auto-Fallback System (Anti-Limit)
The system has an automatic model switching mechanism using the Cache Driver if the primary model's daily quota is exhausted:
1. `gemini-2.5-flash` (Primary - 20 RPD)
2. `gemini-3.1-flash-lite` (Fallback 1 - 500 RPD)
3. `gemma-4-27b-it` (Fallback 2 - 1.5K RPD)
*Any model that hits a rate limit (HTTP 429/503) will enter a 1-hour cooldown period.*

---

## 📁 Project Folder Structure

```
D:\chatbot_llm\
├── docs/                           # Project Documentation
│   ├── api.md                      # REST API & Webhook Specifications
│   ├── database.md                 # Database Design & MySQL Tables
│   └── architecture.md             # Data Flow & Fallback System
│
├── backend/                        # Backend API (Laravel 12)
│   ├── app/Http/Controllers/Api/   # Controllers (Chat, Lead, KB, Webhooks)
│   ├── app/Jobs/                   # Background Processing (ProcessTelegramMessage)
│   ├── app/Models/                 # Eloquent Models (Service, Lead, Message, etc.)
│   ├── app/Repositories/           # Data Access Layer
│   ├── app/Services/               # Core Logic (Gemini, Telegram, WhatsApp, KB)
│   ├── app/Prompts/                # AI Prompt Template (SalesAssistantPrompt)
│   ├── config/                     # CORS & Third-party Services Configuration
│   └── database/                   # Migrations & Seeders
│
└── frontend/                       # Frontend Web (React + Vite + Tailwind v4)
    ├── src/components/             # ChatWidget, LeadForm, Reusable UI
    ├── src/hooks/                  # Custom useChat hook
    ├── src/pages/                  # ChatPage (Web Widget), AdminPage (Leads)
    ├── src/services/               # API call layer (Axios)
    └── src/store/                  # Chat Context State
```

---

## 🛠️ Getting Started & Installation

### Prerequisites
* PHP >= 8.2
* Node.js >= 20.18 (Vite 5 installed for compatibility)
* Composer
* MySQL Database

### 1. Backend Setup (Laravel)

1. Navigate to the backend folder and install dependencies:
   ```bash
   cd backend
   composer install
   ```
2. Copy `.env.example` to `.env` and configure your database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=chatbot_llm
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
3. Add API key configurations in `.env` (Google AI Studio & Platform Tokens):
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
4. Run database migrations and seed it with dummy data:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

### 2. Frontend Setup (React)

1. Navigate to the frontend folder and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
2. Start the local frontend development server:
   ```bash
   npm run dev
   ```

---

## 🚀 How to Run the Application

The application requires three processes running simultaneously for the asynchronous Webhook feature to work smoothly on localhost:

### 1. Run the API Server (Terminal 1)
```bash
cd backend
php artisan serve
```

### 2. Run the Queue Worker (Terminal 2)
```bash
cd backend
php artisan queue:work --timeout=90
```

### 3. Run ngrok tunnel (Terminal 3)
```bash
ngrok http 8000
```
*Use the public HTTPS ngrok URL to register webhooks in Telegram BotFather (`/setWebhook`) or in the Fonnte/Meta Dashboard.*

---

## 💬 Available Telegram Bot Commands
* `/start` - Starts a new conversation and resets the chat history for this session.
* `/clear` - Clears the entire conversation history to start a new topic.
* `/end` - Ends the current chat session with a friendly farewell message.
* `/help` - Displays the list of available commands.

---

## 📄 Additional Documentation
* Complete API Routes: [API Documentation](docs/api.md)
* Database Structure & Tables: [Database Documentation](docs/database.md)
* Detailed System Flow: [Architecture Documentation](docs/architecture.md)
