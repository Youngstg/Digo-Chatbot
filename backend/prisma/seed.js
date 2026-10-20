import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Services
  const servicesData = [
    {
      name: 'Website Company Profile',
      description: 'Website profesional untuk menampilkan profil, layanan, dan kontak bisnis Anda.',
      starting_price: 2500000,
      duration: '7-14 hari',
      features: {
        create: [
          { feature_name: 'Responsive Design', feature_description: 'Tampil sempurna di semua perangkat' },
          { feature_name: 'SEO Basic', feature_description: 'Optimasi mesin pencari dasar' },
          { feature_name: 'Contact Form', feature_description: 'Formulir kontak terintegrasi' },
          { feature_name: 'CMS Admin Panel', feature_description: 'Kelola konten sendiri dengan mudah' },
          { feature_name: '5 Halaman', feature_description: 'Home, About, Services, Portfolio, Contact' },
          { feature_name: 'Konsultasi 1 Bulan', feature_description: 'Support teknis selama 1 bulan' },
        ],
      },
      pricing: {
        create: [
          { package_name: 'Standard', price: 2500000, notes: '5 halaman, domain & hosting 1 tahun' },
          { package_name: 'Premium', price: 4500000, notes: '10 halaman, domain & hosting 2 tahun, premium theme' },
        ],
      },
    },
    {
      name: 'Website E-Commerce',
      description: 'Platform toko online lengkap dengan keranjang belanja, pembayaran, dan manajemen produk.',
      starting_price: 7500000,
      duration: '14-30 hari',
      features: {
        create: [
          { feature_name: 'Katalog Produk', feature_description: 'Kelola produk dengan mudah' },
          { feature_name: 'Keranjang Belanja', feature_description: 'Sistem cart yang mudah digunakan' },
          { feature_name: 'Payment Gateway', feature_description: 'Midtrans / Xendit terintegrasi' },
          { feature_name: 'Manajemen Order', feature_description: 'Tracking pesanan real-time' },
          { feature_name: 'Dashboard Admin', feature_description: 'Panel admin lengkap' },
        ],
      },
      pricing: {
        create: [
          { package_name: 'Basic', price: 7500000, notes: 'Hingga 100 produk' },
          { package_name: 'Professional', price: 12000000, notes: 'Unlimited produk + fitur premium' },
        ],
      },
    },
    {
      name: 'Mobile App Development',
      description: 'Aplikasi mobile Android & iOS yang disesuaikan dengan kebutuhan bisnis Anda.',
      starting_price: 15000000,
      duration: '30-60 hari',
      features: {
        create: [
          { feature_name: 'Android & iOS', feature_description: 'Deploy ke kedua platform' },
          { feature_name: 'UI/UX Design', feature_description: 'Desain antarmuka yang modern' },
          { feature_name: 'Backend API', feature_description: 'API terintegrasi dengan app' },
          { feature_name: 'Push Notification', feature_description: 'Notifikasi real-time' },
        ],
      },
      pricing: {
        create: [
          { package_name: 'Standard', price: 15000000, notes: 'React Native / Flutter' },
        ],
      },
    },
    {
      name: 'UI/UX Design',
      description: 'Desain antarmuka yang menarik, intuitif, dan berorientasi pada pengalaman pengguna.',
      starting_price: 3000000,
      duration: '7-14 hari',
      features: {
        create: [
          { feature_name: 'Wireframe', feature_description: 'Kerangka tampilan halaman' },
          { feature_name: 'Mockup Design', feature_description: 'Desain visual lengkap di Figma' },
          { feature_name: 'Prototyping', feature_description: 'Prototype interaktif' },
          { feature_name: 'Revisi 3x', feature_description: 'Tiga kali revisi desain' },
        ],
      },
      pricing: {
        create: [
          { package_name: 'Standard', price: 3000000, notes: 'Per aplikasi / website' },
        ],
      },
    },
    {
      name: 'Hosting & Maintenance',
      description: 'Layanan hosting cepat dan maintenance rutin agar website Anda selalu optimal.',
      starting_price: 500000,
      duration: 'Per bulan',
      features: {
        create: [
          { feature_name: 'Server SSD', feature_description: 'Performa loading cepat' },
          { feature_name: 'SSL Certificate', feature_description: 'Keamanan HTTPS gratis' },
          { feature_name: 'Backup Harian', feature_description: 'Backup data otomatis' },
          { feature_name: 'Monitoring 24/7', feature_description: 'Pemantauan uptime' },
        ],
      },
      pricing: {
        create: [
          { package_name: 'Basic', price: 500000, notes: 'Per bulan, 10GB storage' },
          { package_name: 'Professional', price: 1000000, notes: 'Per bulan, unlimited bandwidth' },
        ],
      },
    },
    {
      name: 'Digital Marketing',
      description: 'Layanan pemasaran digital untuk meningkatkan visibilitas dan penjualan bisnis Anda.',
      starting_price: 2000000,
      duration: 'Per bulan',
      features: {
        create: [
          { feature_name: 'Social Media Management', feature_description: 'Pengelolaan feed & konten sosmed' },
          { feature_name: 'Google Ads & Meta Ads', feature_description: 'Pemasangan iklan tertarget' },
          { feature_name: 'Laporan Performa', feature_description: 'Laporan analitik bulanan' },
        ],
      },
      pricing: {
        create: [
          { package_name: 'Standard', price: 2000000, notes: 'Per bulan' },
        ],
      },
    },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }

  // 2. Seed Knowledge Base
  const kbEntries = [
    {
      category: 'faq',
      title: 'Berapa lama proses pembuatan website?',
      content: 'Durasi pengerjaan tergantung jenis layanan: Website Company Profile 7-14 hari, E-Commerce 14-30 hari, Mobile App 30-60 hari. Durasi bisa bervariasi tergantung kompleksitas dan kecepatan feedback dari klien.',
    },
    {
      category: 'faq',
      title: 'Apakah bisa melakukan revisi?',
      content: 'Ya, kami menyediakan revisi selama proses pengerjaan. Jumlah revisi tergantung paket yang dipilih. Kami memprioritaskan kepuasan klien dalam setiap proyek.',
    },
    {
      category: 'faq',
      title: 'Apakah ada garansi setelah selesai?',
      content: 'Ya, kami memberikan garansi bug fixing selama 1 bulan setelah project selesai dan diserahterimakan. Garansi mencakup perbaikan bug dan error teknis, tidak termasuk perubahan desain atau fitur baru.',
    },
    {
      category: 'faq',
      title: 'Bagaimana sistem pembayaran?',
      content: 'Sistem pembayaran kami: 50% di awal sebagai tanda jadi, dan 50% setelah project selesai dan disetujui. Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA).',
    },
    {
      category: 'faq',
      title: 'Apakah bisa konsultasi gratis terlebih dahulu?',
      content: 'Tentu! Kami menyediakan konsultasi gratis untuk membahas kebutuhan dan memberikan estimasi biaya sebelum Anda memutuskan. Hubungi tim kami untuk jadwal konsultasi.',
    },
    {
      category: 'policy',
      title: 'Kebijakan Pembayaran',
      content: 'Pembayaran dilakukan 50% di muka dan 50% saat peluncuran. Setelah pembayaran pertama diterima, proyek akan segera dimulai. Jika klien membatalkan di tengah proyek, deposit tidak dapat dikembalikan.',
    },
    {
      category: 'policy',
      title: 'Hak Cipta dan Kepemilikan',
      content: 'Setelah pembayaran lunas, seluruh source code dan aset desain menjadi milik klien sepenuhnya. Kami tidak akan menggunakan project klien tanpa izin, kecuali untuk keperluan portfolio dengan persetujuan.',
    },
    {
      category: 'promotion',
      title: 'Paket Bundling Hemat',
      content: 'Dapatkan diskon 15% untuk pembelian paket bundling: Website + Hosting 1 tahun, atau Website + UI/UX Design + Hosting. Promo berlaku untuk klien baru.',
    },
    {
      category: 'promotion',
      title: 'Diskon Referral',
      content: 'Ajak teman Anda dan dapatkan diskon 10% untuk project berikutnya. Tidak ada batasan jumlah referral.',
    },
    {
      category: 'portfolio',
      title: 'Portfolio Project Kami',
      content: 'Kami telah mengerjakan 50+ project untuk berbagai industri: laundry, toko online fashion, klinik kesehatan, restoran, properti, startup teknologi, pendidikan, dan lainnya. Hubungi tim kami untuk melihat portfolio spesifik sesuai industri Anda.',
    },
  ];

  for (const entry of kbEntries) {
    const existing = await prisma.knowledgeBase.findFirst({ where: { title: entry.title } });
    if (!existing) {
      await prisma.knowledgeBase.create({ data: entry });
    }
  }

  console.log('✅ Seeding database selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
