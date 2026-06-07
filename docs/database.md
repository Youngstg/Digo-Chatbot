# Database Documentation

Database: MySQL | `chatbot_llm`

---

## Diagram ERD

```
services ──────────< service_features
    │
    └──────────────< pricing

conversations ─────< messages
    │
    └──────────────< leads

knowledge_base (standalone)
```

---

## Tabel

### `services`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | Auto increment |
| `name` | varchar(255) | Nama layanan |
| `description` | text | Deskripsi layanan |
| `starting_price` | decimal(15,2) | Harga mulai |
| `duration` | varchar(255) | Estimasi durasi |
| `is_active` | boolean | Status aktif |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

---

### `service_features`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `service_id` | bigint FK | → services.id |
| `feature_name` | varchar(255) | Nama fitur |
| `feature_description` | text | Deskripsi fitur |

---

### `pricing`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `service_id` | bigint FK | → services.id |
| `package_name` | varchar(255) | Nama paket (Standard/Premium) |
| `price` | decimal(15,2) | Harga paket |
| `notes` | text | Catatan tambahan |

---

### `knowledge_base`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `category` | enum | service / pricing / faq / portfolio / promotion / policy |
| `title` | varchar(255) | Judul entri |
| `content` | text | Isi konten |
| `is_active` | boolean | Status aktif |

---

### `conversations`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `session_id` | varchar UNIQUE | ID sesi dari frontend |
| `user_name` | varchar | Nama user (opsional) |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

---

### `messages`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `conversation_id` | bigint FK | → conversations.id |
| `role` | enum | user / assistant / system |
| `content` | text | Isi pesan |
| `created_at` | timestamp | |

---

### `leads`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `name` | varchar(100) | Nama calon pelanggan |
| `email` | varchar | Email (opsional) |
| `phone` | varchar | No. telepon |
| `business_type` | varchar | Jenis bisnis |
| `requirement` | text | Kebutuhan |
| `budget` | varchar | Budget |
| `status` | enum | new / contacted / qualified / closed |
| `conversation_id` | bigint FK | → conversations.id (nullable) |
