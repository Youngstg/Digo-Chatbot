<?php

namespace Database\Seeders;

use App\Models\KnowledgeBase;
use Illuminate\Database\Seeder;

class KnowledgeBaseSeeder extends Seeder
{
    public function run(): void
    {
        $entries = [
            [
                'category' => 'faq',
                'title'    => 'Berapa lama proses pembuatan website?',
                'content'  => 'Durasi pengerjaan tergantung jenis layanan: Website Company Profile 7-14 hari, E-Commerce 14-30 hari, Mobile App 30-60 hari. Durasi bisa bervariasi tergantung kompleksitas dan kecepatan feedback dari klien.',
            ],
            [
                'category' => 'faq',
                'title'    => 'Apakah bisa melakukan revisi?',
                'content'  => 'Ya, kami menyediakan revisi selama proses pengerjaan. Jumlah revisi tergantung paket yang dipilih. Kami memprioritaskan kepuasan klien dalam setiap proyek.',
            ],
            [
                'category' => 'faq',
                'title'    => 'Apakah ada garansi setelah selesai?',
                'content'  => 'Ya, kami memberikan garansi bug fixing selama 1 bulan setelah project selesai dan diserahterimakan. Garansi mencakup perbaikan bug dan error teknis, tidak termasuk perubahan desain atau fitur baru.',
            ],
            [
                'category' => 'faq',
                'title'    => 'Bagaimana sistem pembayaran?',
                'content'  => 'Sistem pembayaran kami: 50% di awal sebagai tanda jadi, dan 50% setelah project selesai dan disetujui. Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA).',
            ],
            [
                'category' => 'faq',
                'title'    => 'Apakah bisa konsultasi gratis terlebih dahulu?',
                'content'  => 'Tentu! Kami menyediakan konsultasi gratis untuk membahas kebutuhan dan memberikan estimasi biaya sebelum Anda memutuskan. Hubungi tim kami untuk jadwal konsultasi.',
            ],
            [
                'category' => 'policy',
                'title'    => 'Kebijakan Pembayaran',
                'content'  => 'Pembayaran dilakukan 50% di muka dan 50% saat peluncuran. Setelah pembayaran pertama diterima, proyek akan segera dimulai. Jika klien membatalkan di tengah proyek, deposit tidak dapat dikembalikan.',
            ],
            [
                'category' => 'policy',
                'title'    => 'Hak Cipta dan Kepemilikan',
                'content'  => 'Setelah pembayaran lunas, seluruh source code dan aset desain menjadi milik klien sepenuhnya. Kami tidak akan menggunakan project klien tanpa izin, kecuali untuk keperluan portfolio dengan persetujuan.',
            ],
            [
                'category' => 'promotion',
                'title'    => 'Paket Bundling Hemat',
                'content'  => 'Dapatkan diskon 15% untuk pembelian paket bundling: Website + Hosting 1 tahun, atau Website + UI/UX Design + Hosting. Promo berlaku untuk klien baru.',
            ],
            [
                'category' => 'promotion',
                'title'    => 'Diskon Referral',
                'content'  => 'Ajak teman Anda dan dapatkan diskon 10% untuk project berikutnya. Tidak ada batasan jumlah referral.',
            ],
            [
                'category' => 'portfolio',
                'title'    => 'Portfolio Project Kami',
                'content'  => 'Kami telah mengerjakan 50+ project untuk berbagai industri: laundry, toko online fashion, klinik kesehatan, restoran, properti, startup teknologi, pendidikan, dan lainnya. Hubungi tim kami untuk melihat portfolio spesifik sesuai industri Anda.',
            ],
        ];

        foreach ($entries as $entry) {
            KnowledgeBase::create($entry);
        }
    }
}
