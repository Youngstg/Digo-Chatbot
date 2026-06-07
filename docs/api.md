# API Documentation

Base URL: `http://localhost:8000/api`

---

## Chat

### `POST /api/chat`

Kirim pesan ke AI dan dapatkan respons.

**Request Body:**
```json
{
  "message": "Saya ingin membuat website toko online",
  "session_id": "sess_abc123",
  "user_name": "Budi"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | ✅ | Pesan dari user (maks 2000 karakter) |
| `session_id` | string | ❌ | ID sesi (auto-generate jika kosong) |
| `user_name` | string | ❌ | Nama user untuk personalisasi |

**Response:**
```json
{
  "reply": "Halo! Untuk toko online, saya rekomendasikan paket E-Commerce...",
  "session_id": "sess_abc123",
  "conversation_id": 1
}
```

---

## Leads

### `POST /api/leads`

Simpan data prospek/calon pelanggan.

**Request Body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@email.com",
  "phone": "08123456789",
  "business_type": "Toko Fashion",
  "requirement": "Ingin membuat website toko online",
  "budget": "5-10 juta",
  "conversation_id": 1
}
```

**Response:**
```json
{
  "message": "Lead berhasil disimpan",
  "data": { "id": 1, "name": "Budi Santoso", "status": "new", ... }
}
```

---

### `GET /api/leads`

Ambil semua data lead (untuk admin dashboard).

**Response:**
```json
{
  "data": [
    { "id": 1, "name": "Budi", "status": "new", ... }
  ]
}
```

---

### `PUT /api/leads/{id}`

Update status lead.

**Request Body:**
```json
{ "status": "contacted" }
```

Status valid: `new` | `contacted` | `qualified` | `closed`

---

## Knowledge Base

### `GET /api/knowledge-base`

Ambil semua knowledge base yang aktif.

### `POST /api/knowledge-base`

Tambah entry knowledge base baru.

```json
{
  "category": "faq",
  "title": "Apakah ada cicilan?",
  "content": "Kami menerima pembayaran bertahap untuk project di atas Rp 10 juta."
}
```

Kategori valid: `service` | `pricing` | `faq` | `portfolio` | `promotion` | `policy`

### `PUT /api/knowledge-base/{id}`

Update entry knowledge base.

### `DELETE /api/knowledge-base/{id}`

Hapus entry knowledge base.
