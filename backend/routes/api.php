<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\FonnteWebhookController;
use App\Http\Controllers\Api\KnowledgeBaseController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\TelegramWebhookController;
use App\Http\Controllers\Api\WhatsAppWebhookController;
use Illuminate\Support\Facades\Route;

// ─── Web Chat API ────────────────────────────────────────────────
Route::post('/chat', [ChatController::class, 'store']);

Route::prefix('leads')->group(function () {
    Route::get('/',      [LeadController::class, 'index']);
    Route::post('/',     [LeadController::class, 'store']);
    Route::put('/{id}',  [LeadController::class, 'update']);
});

Route::prefix('knowledge-base')->group(function () {
    Route::get('/',        [KnowledgeBaseController::class, 'index']);
    Route::post('/',       [KnowledgeBaseController::class, 'store']);
    Route::put('/{id}',    [KnowledgeBaseController::class, 'update']);
    Route::delete('/{id}', [KnowledgeBaseController::class, 'destroy']);
});

// ─── Telegram Webhook ────────────────────────────────────────────
Route::prefix('webhook/telegram')->group(function () {
    Route::post('/',       [TelegramWebhookController::class, 'handle']);
    Route::post('/set',    [TelegramWebhookController::class, 'setWebhook']);
    Route::post('/delete', [TelegramWebhookController::class, 'deleteWebhook']);
});

// ─── WhatsApp Cloud API Webhook ──────────────────────────────────
Route::prefix('webhook/whatsapp')->group(function () {
    Route::get('/',  [WhatsAppWebhookController::class, 'verify']);   // Meta verification
    Route::post('/', [WhatsAppWebhookController::class, 'handle']);
});

// ─── Fonnte (WhatsApp Alternative) Webhook ───────────────────────
Route::post('/webhook/fonnte', [FonnteWebhookController::class, 'handle']);
